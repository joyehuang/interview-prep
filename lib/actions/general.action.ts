'use server';

import { feedbackSchema } from './../../constants/index';
import { db } from "@/firebase/admin";
import { google } from '@ai-sdk/google';
import { generateObject } from "ai";
import { getCurrentUser } from "../actions/auth.action";

export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
      return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
  }
  
export async function getLatestInterview(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit=20 } = params;
  
    const interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();
    
      return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
  }

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db
      .collection("interviews")
      .doc(id)
      .get(); 
    
      return interview.data() as Interview;
  }

export async function createFeedback(params: CreateFeedbackParams) {
  try {
    const { interviewId, userId, transcript } = params;

    const formattedTranscript = transcript
      .map((sentence: {role: string, content: string}) => `- ${sentence.role}: ${sentence.content}\n`).join("");

    const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
      - **Communication Skills**: Clarity, articulation, structured responses.
      - **Technical Knowledge**: Understanding of key concepts for the role.
      - **Problem-Solving**: Ability to analyze problems and propose solutions.
      - **Cultural & Role Fit**: Alignment with company values and job role.
      - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system:
            "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
  });

  const feedback = await db.collection("feedbacks").add({
    interviewId,
    userId,
    totalScore,
    categoryScores,
    strengths,
    areasForImprovement,
    finalAssessment,
    createdAt: new Date().toISOString(),
  })

  return {
    success: true,
    feedbackId: feedback.id,
  }

  } catch(e) {
    console.error(e);

    return {
      success: false,
    }
  }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection("feedbacks")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();
  
  if(feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}

export async function retakeInterview(originalInterviewId: string): Promise<{ success: boolean; newInterviewId?: string }>{
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false };
    }

    const original = await getInterviewById(originalInterviewId);
    if (!original) {
      return { success: false };
    }

    const newInterview = {
      role: original.role,
      type: original.type,
      level: original.level,
      techstack: original.techstack,
      questions: original.questions,
      userId: user.id,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(newInterview);
    return { success: true, newInterviewId: docRef.id };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function retake(id: string) {
  const { success, newInterviewId } = await retakeInterview(id);
  if (success && newInterviewId) {
    return `/interview/${newInterviewId}`;
  }
  return "/";
}