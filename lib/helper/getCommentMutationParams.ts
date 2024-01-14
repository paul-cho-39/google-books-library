import { UseQueryResult } from '@tanstack/react-query';
import { CommentPayload, ErrorResponse } from '../types/response';
import { BaseIdParams, MutationCommentParams } from '../types/models/books';

function getMutationParams(
   result: CommentPayload,
   params: BaseIdParams,
   pageIndex: number
): MutationCommentParams {
   const commentId = result.id;
   const parentId = result.parentId || NaN;
   return {
      commentId,
      parentId,
      pageIndex,
      ...params,
   };
}

export default getMutationParams;
