import { db } from "../../services/firebase";

export async function wandaCreateReview({
  callId,
  placeId,
  comment,
  rating,
}: {
  callId: string;
  placeId: string;
  comment: string;
  rating: number;
}): Promise<{
  message: string;
  error: boolean;
}> {
  console.log("wandaCreateReview called with parameters:", {
    callId,
    placeId,
    comment,
    rating,
  });

  try {
    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return {
        message: "Please provide a rating between 1 and 5 stars.",
        error: true,
      };
    }

    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return {
        message: "Please provide a comment for your review.",
        error: true,
      };
    }

    // Validate placeId
    if (!placeId || placeId.trim().length === 0) {
      return {
        message: "I need a valid place ID to save your review.",
        error: true,
      };
    }

    // Get the caller's phone number from the call record
    const callDoc = await db.collection("calls").doc(callId).get();

    if (!callDoc.exists) {
      console.error(`Call record with ID ${callId} not found.`);
      return {
        message: "Call record not found.",
        error: true,
      };
    }

    const callData = callDoc.data();
    const callerPhoneNumber = callData?.callerPhoneNumber;

    if (!callerPhoneNumber) {
      console.error(
        `Caller phone number not found in call record with ID ${callId}.`
      );
      return {
        message: "Caller phone number not found.",
        error: true,
      };
    }

    // Clean the phone number for consistency
    const phoneNumberId = callerPhoneNumber.replace("+1", "");

    // Create the review document
    const reviewData = {
      placeId: placeId.trim(),
      comment: comment.trim(),
      rating: rating,
      phoneNumber: phoneNumberId,
      createdAt: new Date().toISOString(),
      callId: callId,
    };

    // Add the review to the reviews collection
    const reviewRef = await db.collection("reviews").add(reviewData);

    console.log(`Created review with ID ${reviewRef.id} for place ${placeId} by ${phoneNumberId}`);

    // Create success message based on rating
    let ratingText = "";
    switch (rating) {
      case 5:
        ratingText = "5-star";
        break;
      case 4:
        ratingText = "4-star";
        break;
      case 3:
        ratingText = "3-star";
        break;
      case 2:
        ratingText = "2-star";
        break;
      case 1:
        ratingText = "1-star";
        break;
      default:
        ratingText = `${rating}-star`;
    }

    const message = `Perfect! I've saved your ${ratingText} review. Your feedback helps other people discover great places and helps businesses improve their service. Thank you for sharing your experience!`;

    return {
      message,
      error: false,
    };
  } catch (error: any) {
    console.error(`Error creating review for call ${callId}:`, error);

    if (error.code && error.message) {
      console.error("Error details:", {
        code: error.code,
        message: error.message,
      });
    }

    return {
      message: "I'm sorry, I couldn't save your review right now. Please try again later.",
      error: true,
    };
  }
}
