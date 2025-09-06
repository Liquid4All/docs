import bigquery from '@google-cloud/bigquery/build/src/types';

import { getBigQueryClient } from '@/lib/bqClient';

interface BaseAnalyticsEvent {
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

interface AnalyticsEvent extends BaseAnalyticsEvent {
  eventType: 'event';
  eventName: string;
  eventData?: string;
}

interface PageviewEvent extends BaseAnalyticsEvent {
  eventType: 'pageview';
}

type VercelAnalyticsEvent = AnalyticsEvent | PageviewEvent;

// Transform functions to convert camelCase to snake_case for BigQuery
function transformEventForBigQuery(event: AnalyticsEvent) {
  return {
    event_name: event.eventName,
    event_data: event.eventData ? JSON.parse(event.eventData) : null,
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
    query_params: event.queryParams ? JSON.parse(event.queryParams) : null,
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
    query_params: event.queryParams ? JSON.parse(event.queryParams) : null,
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

const isTableDataInsertAllResponse = (
  response: bigquery.ITableDataInsertAllResponse | bigquery.ITable
): response is bigquery.ITableDataInsertAllResponse => {
  return response.kind === 'bigquery#tableDataInsertAllResponse';
};

export class VercelAnalyticsBigQueryService {
  private bigQuery = getBigQueryClient();
  private dataset = 'vercel_analytics';
  private eventsTable = 'event';
  private pageviewsTable = 'pageview';

  async insertEvents(events: VercelAnalyticsEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const analyticsEvents = events.filter(
      (event): event is AnalyticsEvent => event.eventType === 'event'
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
      console.warn(`Encountered ${unknownEvents.length} events with unknown eventType`);
    }
  }

  private async insertAnalyticsEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      const rows = events.map(transformEventForBigQuery);

      const [response] = await this.bigQuery
        .dataset(this.dataset)
        .table(this.eventsTable)
        .insert(rows);

      if (isTableDataInsertAllResponse(response)) {
        if (response.insertErrors != null) {
          console.error('BigQuery insert errors for events:', response.insertErrors);
          throw new Error(`Failed to insert ${response.insertErrors.length} events`);
        }
      }

      console.info(`Successfully inserted ${events.length} analytics events to BigQuery`);
    } catch (error) {
      console.error('Error inserting analytics events to BigQuery:', error);
      throw error;
    }
  }

  private async insertPageviewEvents(events: PageviewEvent[]): Promise<void> {
    try {
      const rows = events.map(transformPageviewForBigQuery);

      const [response] = await this.bigQuery
        .dataset(this.dataset)
        .table(this.pageviewsTable)
        .insert(rows);

      if (isTableDataInsertAllResponse(response) && response.insertErrors != null) {
        console.error('BigQuery insert errors for pageviews:', response.insertErrors);
        throw new Error(`Failed to insert ${response.insertErrors.length} pageviews`);
      }

      console.info(`Successfully inserted ${events.length} pageview events to BigQuery`);
    } catch (error) {
      console.error('Error inserting pageview events to BigQuery:', error);
      throw error;
    }
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

export const vercelAnalyticsService = new VercelAnalyticsBigQueryService();
