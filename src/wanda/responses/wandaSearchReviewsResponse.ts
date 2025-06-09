import { db } from "../../services/firebase";

interface Review {
  id: string;
  placeId: string;
  comment: string;
  rating: number;
  phoneNumber: string;
  createdAt: string;
  callId: string;
}

export async function wandaSearchReviews({
  callId,
  placeId,
  placeName,
}: {
  callId: string;
  placeId: string;
  placeName?: string;
}): Promise<{
  message: string;
  error: boolean;
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}> {
  console.log("wandaSearchReviews called with parameters:", {
    callId,
    placeId,
    placeName,
  });

  try {
    // Validate placeId
    if (!placeId || placeId.trim().length === 0) {
      return {
        message: "I need a valid place ID to search for reviews.",
        error: true,
      };
    }

    // Search for reviews with the given placeId
    const reviewsSnapshot = await db
      .collection("reviews")
      .where("placeId", "==", placeId.trim())
      .orderBy("createdAt", "desc")
      .get();

    if (reviewsSnapshot.empty) {
      const placeText = placeName ? ` for ${placeName}` : ` for this place`;
      return {
        message: `I couldn't find any reviews${placeText} yet. You could be the first to leave a review!`,
        error: false,
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
      };
    }

    // Process the reviews
    const reviews: Review[] = [];
    let totalRating = 0;
    const reviewComments: string[] = [];

    reviewsSnapshot.forEach((doc) => {
      const reviewData = doc.data();
      const review: Review = {
        id: doc.id,
        placeId: reviewData.placeId,
        comment: reviewData.comment,
        rating: reviewData.rating,
        phoneNumber: reviewData.phoneNumber,
        createdAt: reviewData.createdAt,
        callId: reviewData.callId,
      };
      
      reviews.push(review);
      totalRating += review.rating;
      
      // Collect comments for summary
      if (review.comment && review.comment.trim()) {
        reviewComments.push(review.comment.trim());
      }
    });

    const totalReviews = reviews.length;
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10; // Round to 1 decimal place

    // Create a formatted message with the review summary
    const placeText = placeName ? placeName : "this place";
    const starText = averageRating === 1 ? "star" : "stars";
    const reviewText = totalReviews === 1 ? "review" : "reviews";

    let message = `I found ${totalReviews} ${reviewText} for ${placeText} with an average rating of ${averageRating} ${starText}.`;

    // Add some sample comments if available
    if (reviewComments.length > 0) {
      message += "\n\nHere's what people are saying:";
      
      // Include up to 3 most recent comments
      const samplesToShow = Math.min(3, reviewComments.length);
      for (let i = 0; i < samplesToShow; i++) {
        const comment = reviewComments[i];
        // Truncate long comments
        const truncatedComment = comment.length > 100 
          ? comment.substring(0, 100) + "..." 
          : comment;
        message += `\n• "${truncatedComment}"`;
      }

      if (reviewComments.length > 3) {
        const remaining = reviewComments.length - 3;
        message += `\n\nAnd ${remaining} more ${remaining === 1 ? 'review' : 'reviews'}.`;
      }
    }

    // Add encouragement for user to leave a review
    message += "\n\nWould you like to leave your own review for this place?";

    console.log(`Found ${totalReviews} reviews for place ${placeId} with average rating ${averageRating}`);

    return {
      message,
      error: false,
      reviews,
      averageRating,
      totalReviews,
    };
  } catch (error: any) {
    console.error(`Error searching reviews for place ${placeId}:`, error);

    if (error.code && error.message) {
      console.error("Error details:", {
        code: error.code,
        message: error.message,
      });
    }

    return {
      message: "I'm sorry, I couldn't search for reviews right now. Please try again later.",
      error: true,
    };
  }
}
