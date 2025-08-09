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
  OpenedProfileDropdown = 'OpenedProfileDropdown',
  ClickedCodeBlockTab = 'ClickedCodeBlockTab',
  OpenedFeedbackModal = 'OpenedFeedbackModal',
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
  OpenedMobileFilterDialog = 'OpenedMobileFilterDialog',
  UpdatedModelProviderFilter = 'UpdatedModelProviderFilter',
}
