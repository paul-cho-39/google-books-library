import { RatingResponseData, ResponseError, MetaDataParams } from '../../../lib/types/response';
import ApiResponseBase from './apiResponse';

export default class ApiRatingResponse<T> extends ApiResponseBase<T> {
   ratingData: RatingResponseData | null;

   constructor(
      data: T | null,
      ratingData: RatingResponseData | null,
      error?: ResponseError,
      meta?: MetaDataParams
   ) {
      super(data, error, meta);
      this.ratingData = ratingData;
   }
   toJson() {
      const baseData = super.toJson();
      return {
         ...baseData,
         ratingData: this.ratingData,
      };
   }
}
