import type {
  AppVersionListItem,
  AppVersionsListResponse,
  AppVersionsQueryParams,
  AppVersionPlatform,
  AppVersionStatus,
  AppVersionType,
} from "@/types";

import AppVersionsTable from "./results/app-versions-table";
import AppVersionsStats from "./stats";
import AppVersionsToolbar from "./toolbar";

type AppVersionsMainContentProps = {
  data?: AppVersionsListResponse;
  params: AppVersionsQueryParams;
  onParamsChange: (params: Partial<AppVersionsQueryParams>) => void;
  onViewAppVersion: (appVersion: AppVersionListItem) => void;
  onEditAppVersion: (appVersion: AppVersionListItem) => void;
  onDeleteAppVersion: (appVersion: AppVersionListItem) => void;
};

function AppVersionsMainContent({
  data,
  params,
  onParamsChange,
  onViewAppVersion,
  onEditAppVersion,
  onDeleteAppVersion,
}: AppVersionsMainContentProps) {
  return (
    <>
      <AppVersionsStats appVersions={data?.data ?? []} />
      <AppVersionsToolbar
        selectedPlatform={params.platform}
        selectedStatus={params.status}
        selectedType={params.type}
        onPlatformChange={(platform?: AppVersionPlatform) =>
          onParamsChange({ platform })
        }
        onStatusChange={(status?: AppVersionStatus) => onParamsChange({ status })}
        onTypeChange={(type: AppVersionType) => onParamsChange({ type })}
      />
      <AppVersionsTable
        appVersions={data?.data ?? []}
        onViewAppVersion={onViewAppVersion}
        onEditAppVersion={onEditAppVersion}
        onDeleteAppVersion={onDeleteAppVersion}
      />
    </>
  );
}

export default AppVersionsMainContent;
