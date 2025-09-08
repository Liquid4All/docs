/**
 * Naming conventions:
 * - Start with a past tense verb.
 * - Use CamelCase.
 * - Use same key and value. This is checked by unit test.
 * - Prefer to use existing verbs instead of introducing new ones.
 * - Differences among Opened, closed, cancelled, togged, clicked:
 *   - If both the open and close events need to be tracked separately, use "Opened" and "Closed".
 *   - If they are tracked together, use "Toggled".
 *   - If only the open event needs to be tracked, use "Opened". In case the close event needs to be tracked later, it can be added as "Closed".
 *   - Use "Cancelled" instead of "Closed" to emphasize that the user cancelled an action without doing anything.
 *     - E.g. there is a difference between downloading a bundle and then closing the modal vs. simply closing it (cancelled).
 *   - Use "Clicked" for button clicks without opening anything.
 */
export enum AnalyticEvent {
  OpenedClickedModelDetailsCard = 'OpenedClickedModelDetailsCard',
  // start of bundle download events
  OpenedDownloadDropdown = 'OpenedDownloadDropdown',
  OpenedLicensePage = 'OpenedLicensePage',
  // this is the download card showing the license agreement and download button
  OpenedBundleDownloadCard = 'OpenedBundleDownloadCard',
  CancelledBundleDownloadCard = 'CancelledBundleDownloadCard',
  DownloadedModelBundle = 'DownloadedModelBundle',
  // end of bundle download events
  ScannedApolloQRCode = 'ScannedApolloQRCode',
  ClickedApolloDeeplink = 'ClickedApolloDeeplink',
  OpenedProfileDropdown = 'OpenedProfileDropdown',
  ClickedCodeBlockTab = 'ClickedCodeBlockTab',
  ClickedCopiedCode = 'ClickedCopiedCode',
  OpenedFeedbackModal = 'OpenedFeedbackModal',
  ClickedSubmitFeedback = 'ClickedSubmitFeedback',
  ToggledMobileMenu = 'ToggledMobileMenu',
  QueriedDocumentation = 'QueriedDocumentation',
  QueriedModelLibrary = 'QueriedModelLibrary',
  UpdatedTagsFilter = 'UpdatedTagsFilter',
  UpdatedSizeRangeFilter = 'UpdatedSizeRangeFilter',
  OpenedModelBreadcrumbDropdown = 'OpenedModelBreadcrumbDropdown',
  ToggledCloudComparisonView = 'ToggledCloudComparisonView',
  ToggledFaqItem = 'ToggledFaqItem',
  ClickedHistogramBin = 'ClickedHistogramBin',
  UpdatedModelSortingOrder = 'UpdatedModelSortingOrder',
  ToggledViewMode = 'ToggledViewMode',
  ClearedAllFilters = 'ClearedAllFilters',
  ClickedPlaygroundButton = 'ClickedPlaygroundButton',
  ClickedFinetuneButton = 'ClickedFinetuneButton',
  OpenedMobileFilterDialog = 'OpenedMobileFilterDialog',
  UpdatedModelProviderFilter = 'UpdatedModelProviderFilter',
  ClickedModelSubscribe = 'ClickedModelSubscribe',
  RanLeapBundleLogin = 'RanLeapBundleLogin',
  RanLeapBundleWhoami = 'RanLeapBundleWhoami',
  RanLeapBundleCreate = 'RanLeapBundleCreate',
  RanLeapBundleListAll = 'RanLeapBundleListAll',
  RanLeapBundleListRequest = 'RanLeapBundleListRequest',
  RanLeapBundleUpdate = 'RanLeapBundleUpdate',
  RanLeapBundleCancel = 'RanLeapBundleCancel',
  RanLeapBundleDownload = 'RanLeapBundleDownload',
  ClickedPricingPageButton = 'ClickedPricingPageButton',
  ClickedNavbarItem = 'ClickedNavbarItem',
  ClickedDiscordFromHome = 'ClickedDiscordFromHome',
  ClickedHackatonFromHome = 'ClickedHackatonFromHome',
  ClickedPlatformFeature = 'ClickedPlatformFeature',
  ClickedResourcesFromHome = 'ClickedResourcesFromHome',
  ClickedSetupFromHome = 'ClickedSetupFromHome',
  ClickedAnnouncement = 'ClickedAnnouncement',
  ClickedHeroFromHome = 'ClickedHeroFromHome',
  // Best Model Search events
  BMSSessionStarted = 'BMSSessionStarted',
  BMSTaskDescribed = 'BMSTaskDescribed',
  BMSContinuedToUseCase = 'BMSContinuedToUseCase',
  BMSContinuedToTestCases = 'BMSContinuedToTestCases',
  BMSContinuedToModelComparison = 'BMSContinuedToModelComparison',
  BMSEditScenariosSelected = 'BMSEditScenariosSelected',
  BMSRanModelComparison = 'BMSRanModelComparison',
  BMSWinnerShown = 'BMSWinnerShown',
  BMSSharedResults = 'BMSSharedResults',
  BMSClickedOnModelButton = 'BMSClickedOnModelButton',
  BMSRestartClicked = 'BMSRestartClicked',
  BMSSelectedTaskTemplate = 'BMSSelectedTaskTemplate',
  BMSEditedSystemPrompt = 'BMSEditedSystemPrompt',
  BMSClickedRegenerateTestCases = 'BMSClickedRegenerateTestCases',
  BMSClickedBackToUseCase = 'BMSClickedBackToUseCase',
  BMSClickedBackToTestCase = 'BMSClickedBackToTestCase',
  BMSOpenedModelDetailsModal = 'BMSOpenedModelDetailsModal',
  BMSToggledViewMode = 'BMSToggledViewMode',
}
