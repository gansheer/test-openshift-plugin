import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import '../../camel.css';
import CamelIntegrationRow from './CamelIntegrationRow';
import useCamelIntegrationColumns from './useCamelIntegrationColumns';
import { cronJobGVK, deploymentConfigGVK, deploymentGVK } from '../../const';
import { CamelIntegrationKind } from '../../types';

// Note : using this as inspiration for the list: https://github.com/openshift-pipelines/console-plugin/blob/main/src/components/projects-list/ProjectsRow.tsx#L91

type CamelIntegrationProps = {
  ns: string;
  showTitle?: boolean;
};

const CamelIntegrationList: React.FC<CamelIntegrationProps> = ({ ns, showTitle = true }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const [activeNamespace, setActiveNamespace] = useActiveNamespace();

  const filterCamelIntegrationsNamespace = (activeNamespace: string): string => {
    return activeNamespace === '#ALL_NS#' ? '' : activeNamespace;
  };

  const watchedResources: WatchK8sResources<{
    deployments: CamelIntegrationKind[];
    deploymentConfigs: CamelIntegrationKind[];
    cronJobs: CamelIntegrationKind[];
  }> = {
    deployments: {
      isList: true,
      groupVersionKind: deploymentGVK,
      namespaced: true,
      namespace: filterCamelIntegrationsNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
    deploymentConfigs: {
      isList: true,
      groupVersionKind: deploymentConfigGVK,
      namespaced: true,
      namespace: filterCamelIntegrationsNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
    cronJobs: {
      isList: true,
      groupVersionKind: cronJobGVK,
      namespaced: true,
      namespace: filterCamelIntegrationsNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
  };

  const resources = useK8sWatchResources<{
    deployments: CamelIntegrationKind[];
    deploymentConfigs: CamelIntegrationKind[];
    cronJobs: CamelIntegrationKind[];
  }>(watchedResources);


  const columns = useCamelIntegrationColumns(filterCamelIntegrationsNamespace(activeNamespace));
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
          Row={CamelIntegrationRow}
          unfilteredData={staticData}
        />
      </ListPageBody>

    </>
  );
};

export default CamelIntegrationList;