import { track } from '@vercel/analytics/server';
import { NextResponse } from 'next/server';

import { AnalyticEvent } from '@/lib/analytics';
import { TrackingValueType } from '@/lib/analytics/types';
import { ApiKeyValidationError, ApiKeyValidationSuccess } from '@/lib/api-token-validation';

export class CliCommandTracker {
  private readonly analyticEvent: AnalyticEvent;

  public constructor(analyticEvent: AnalyticEvent) {
    this.analyticEvent = analyticEvent;
  }

  public getSuccessResponse(
    responseData: any,
    validationResult: ApiKeyValidationSuccess,
    trackingData?: Record<string, TrackingValueType>
  ) {
    track(this.analyticEvent, {
      success: true,
      email: validationResult.userEmail,
      ...trackingData,
    });
    return NextResponse.json(responseData);
  }

  public getValidationErrorResponse(
    validationResult: ApiKeyValidationError,
    trackingData?: Record<string, TrackingValueType>
  ) {
    track(this.analyticEvent, {
      success: false,
      statusCode: 401,
      error: validationResult.error,
      ...trackingData,
    });
    return NextResponse.json({ error: validationResult.error }, { status: 401 });
  }

  public getHandlerErrorResponse(
    statusCode: number,
    userErrorMessage: any,
    validationResult?: ApiKeyValidationSuccess,
    error?: any
  ) {
    const errorMessage =
      userErrorMessage instanceof Error ? userErrorMessage.message : String(userErrorMessage);
    track(this.analyticEvent, {
      success: false,
      statusCode,
      userErrorMessage: errorMessage.slice(0, 50),
      email: validationResult?.userEmail ?? null,
      error: error != null ? String(error).slice(0, 50) : null,
    });
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
