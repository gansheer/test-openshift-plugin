import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  K8sResourceKind,
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  NamespaceBar,
  useActiveNamespace,
  useK8sWatchResources,
  useListPageFilter,
  VirtualizedTable,
  WatchK8sResources,
} from '@openshift-console/dynamic-plugin-sdk';
import './camel.css';
import CamelApplicationRow from './CamelApplicationRow';
import useCamelApplicationsColumns from './useCamelApplicationsColumns';

// Note : using this as inspiration for the list: https://github.com/openshift-pipelines/console-plugin/blob/main/src/components/projects-list/ProjectsRow.tsx#L91

type CamelApplicationProps = {
  namespace: string;
  showTitle?: boolean;
};

type CamelApplicationKind = K8sResourceKind & {
  spec?: {
    camelSpec: string;
  };
};

// TODO refactor => move somewhere else
const deploymentGVK = {
  group: 'apps',
  version: 'v1',
  kind: 'Deployment',
};
const deploymentConfigGVK = {
  group: 'apps.openshift.io',
  version: 'v1',
  kind: 'DeploymentConfig',
};
const cronJobGVK = {
  group: 'batch',
  version: 'v1',
  kind: 'CronJob',
};

const CamelApplicationList: React.FC<CamelApplicationProps> = ({ namespace, showTitle = true }) => {
  const { t } = useTranslation('plugin__test-openshift-plugin');

  const [activeNamespace, setActiveNamespace] = useActiveNamespace();

  const filterCamelApplicationsNamespace = (activeNamespace: string): string => {
    return activeNamespace === '#ALL_NS#' ? '' : activeNamespace;
  };

  const watchedResources: WatchK8sResources<{
    deployments: CamelApplicationKind[];
    deploymentConfigs: CamelApplicationKind[];
    cronJobs: CamelApplicationKind[];
  }> = {
    deployments: {
      isList: true,
      groupVersionKind: deploymentGVK,
      namespaced: true,
      namespace: filterCamelApplicationsNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
    deploymentConfigs: {
      isList: true,
      groupVersionKind: deploymentConfigGVK,
      namespaced: true,
      namespace: filterCamelApplicationsNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
    cronJobs: {
      isList: true,
      groupVersionKind: cronJobGVK,
      namespaced: true,
      namespace: filterCamelApplicationsNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
  };

  const resources = useK8sWatchResources<{
    deployments: CamelApplicationKind[];
    deploymentConfigs: CamelApplicationKind[];
    cronJobs: CamelApplicationKind[];
  }>(watchedResources);


  const columns = useCamelApplicationsColumns(filterCamelApplicationsNamespace(activeNamespace));
  const resourcesData = [
    ...resources.deploymentConfigs.data,
    ...resources.deployments.data,
    ...resources.cronJobs.data,
  ];

  const [staticData, filteredData, onFilterChange] = useListPageFilter(resourcesData);

  const resourcesLoaded =
    resources.deploymentConfigs.loaded && resources.deployments.loaded && resources.cronJobs.loaded;
  const resourcesLoadError =
    resources.deploymentConfigs.loadError +
    resources.deployments.loadError +
    resources.cronJobs.loadError;

  // TODO add filters

  return (
    <>
      <NamespaceBar onNamespaceChange={setActiveNamespace} />


      <ListPageHeader title={'Camel'} />

      <ListPageBody>

        <ListPageFilter
          data={staticData}
          onFilterChange={onFilterChange}
          loaded={resourcesLoaded}
        />

        <VirtualizedTable
          EmptyMsg={() => (
            <div
              className="pf-v5-u-text-align-center virtualized-table-empty-msg"
              id="no-templates-msg"
            >
              {t('No resources found')}
            </div>
          )}
          columns={columns}
          data={filteredData}
          loaded={resourcesLoaded}
          loadError={resourcesLoadError}
          Row={CamelApplicationRow}
          unfilteredData={staticData}
        />
      </ListPageBody>

    </>
  );
};

export default CamelApplicationList;
