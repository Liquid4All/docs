import bigquery from '@google-cloud/bigquery/build/src/types';

import { getBigQueryClient } from '@/lib/bqClient';

interface BaseAnalyticEvent {
  eventType: 'event' | 'pageview';
  timestamp: number;
  projectId: string;
  ownerId: string;
  dataSourceName: string;
  sessionId: number;
  deviceId: number;
  origin?: string;
  path?: string;
  queryParams?: string;
  country?: string;
  osName?: string;
  osVersion?: string;
  clientName?: string;
  clientType?: string;
  clientVersion?: string;
  deviceType?: string;
  deviceBrand?: string;
  browserEngine?: string;
  browserEngineVersion?: string;
  sdkVersion?: string;
  sdkName?: string;
  sdkVersionFull?: string;
  vercelEnvironment?: string;
  vercelUrl?: string;
  deployment?: string;
  route?: string;
  schema?: string;
}

export interface AnalyticEvent extends BaseAnalyticEvent {
  eventType: 'event';
  eventName: string;
  eventData?: string;
}

export interface PageviewEvent extends BaseAnalyticEvent {
  eventType: 'pageview';
}

export type VercelAnalyticEvent = AnalyticEvent | PageviewEvent;

// Transform functions to convert camelCase to snake_case for BigQuery
function transformEventForBigQuery(event: AnalyticEvent) {
  return {
    event_name: event.eventName,
    event_data: event.eventData,
    event_type: event.eventType,
    timestamp: new Date(event.timestamp).toISOString(),
    date: new Date(event.timestamp).toISOString().split('T')[0],
    project_id: event.projectId,
    owner_id: event.ownerId,
    data_source_name: event.dataSourceName,
    session_id: event.sessionId,
    device_id: event.deviceId,
    origin: event.origin || null,
    path: event.path || null,
    query_params: event.queryParams,
    route: event.route || null,
    country: event.country || null,
    os_name: event.osName || null,
    os_version: event.osVersion || null,
    client_name: event.clientName || null,
    client_type: event.clientType || null,
    client_version: event.clientVersion || null,
    device_type: event.deviceType || null,
    device_brand: event.deviceBrand || null,
    browser_engine: event.browserEngine || null,
    browser_engine_version: event.browserEngineVersion || null,
    sdk_version: event.sdkVersion || null,
    sdk_name: event.sdkName || null,
    sdk_version_full: event.sdkVersionFull || null,
    vercel_environment: event.vercelEnvironment || null,
    vercel_url: event.vercelUrl || null,
    deployment: event.deployment || null,
    schema: event.schema || null,
  };
}

function transformPageviewForBigQuery(event: PageviewEvent) {
  return {
    event_type: event.eventType,
    timestamp: new Date(event.timestamp).toISOString(),
    date: new Date(event.timestamp).toISOString().split('T')[0],
    project_id: event.projectId,
    owner_id: event.ownerId,
    data_source_name: event.dataSourceName,
    session_id: event.sessionId,
    device_id: event.deviceId,
    origin: event.origin || null,
    path: event.path || null,
    query_params: event.queryParams,
    route: event.route || null,
    country: event.country || null,
    os_name: event.osName || null,
    os_version: event.osVersion || null,
    client_name: event.clientName || null,
    client_type: event.clientType || null,
    client_version: event.clientVersion || null,
    device_type: event.deviceType || null,
    device_brand: event.deviceBrand || null,
    browser_engine: event.browserEngine || null,
    browser_engine_version: event.browserEngineVersion || null,
    sdk_version: event.sdkVersion || null,
    sdk_name: event.sdkName || null,
    sdk_version_full: event.sdkVersionFull || null,
    vercel_environment: event.vercelEnvironment || null,
    vercel_url: event.vercelUrl || null,
    deployment: event.deployment || null,
    schema: event.schema || null,
  };
}

export const PROD_DATASET = 'vercel_analytics';
export const DEV_DATASET = 'vercel_analytics_dev';

export class VercelAnalyticsBigQueryService {
  private bigQuery = getBigQueryClient();
  private dataset: string;
  private eventsTable: string = 'event';
  private pageviewsTable: string = 'pageview';

  public constructor(dataset: string = DEV_DATASET) {
    console.info(`Using BigQuery dataset: ${dataset}`);
    this.dataset = dataset;
  }

  async insertEvents(events: VercelAnalyticEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const analyticsEvents = events.filter(
      (event): event is AnalyticEvent => event.eventType === 'event'
    );
    if (analyticsEvents.length > 0) {
      await this.insertAnalyticsEvents(analyticsEvents);
    }

    const pageviewEvents = events.filter(
      (event): event is PageviewEvent => event.eventType === 'pageview'
    );
    if (pageviewEvents.length > 0) {
      await this.insertPageviewEvents(pageviewEvents);
    }

    const unknownEvents = events.filter(
      (event) => event.eventType !== 'event' && event.eventType !== 'pageview'
    );
    if (unknownEvents.length > 0) {
      console.warn(
        `Encountered ${unknownEvents.length} events with unknown eventType`,
        unknownEvents
      );
    }
  }

  private async insertAnalyticsEvents(events: AnalyticEvent[]): Promise<void> {
    try {
      const rows = events.map(transformEventForBigQuery);
      await this.bigQuery.dataset(this.dataset).table(this.eventsTable).insert(rows);
      console.info(`Successfully inserted ${events.length} analytics events to BigQuery`);
    } catch (error) {
      this.handleBigQueryInsertError(error, events);
      throw error;
    }
  }

  private async insertPageviewEvents(events: PageviewEvent[]): Promise<void> {
    try {
      const rows = events.map(transformPageviewForBigQuery);
      await this.bigQuery.dataset(this.dataset).table(this.pageviewsTable).insert(rows);
      console.info(`Successfully inserted ${events.length} pageview events to BigQuery`);
    } catch (error: any) {
      this.handleBigQueryInsertError(error, events);
      throw error;
    }
  }

  private handleBigQueryInsertError(error: any, events: any[]): void {
    console.error('BigQuery insert error:', {
      name: error.name,
      message: error.message,
      errors: JSON.stringify(error.errors),
      response: JSON.stringify(error.response),
    });

    if (events.length > 0) {
      const sampleEvent = events[0];
      console.error('Sample event data:', JSON.stringify(sampleEvent));
      console.error(
        'Sample transformed data:',
        JSON.stringify(transformPageviewForBigQuery(sampleEvent))
      );
    }
  }

  private static isTableDataInsertAllResponse(
    response: bigquery.ITableDataInsertAllResponse | bigquery.ITable
  ): response is bigquery.ITableDataInsertAllResponse {
    return response.kind === 'bigquery#tableDataInsertAllResponse';
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.bigQuery.dataset(this.dataset).get();
      return true;
    } catch (error) {
      console.error('BigQuery connection test failed:', error);
      return false;
    }
  }
}
