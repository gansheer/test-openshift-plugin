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
import './example.css';
import useResourcesColumns from './useResourcesColumns';
import ResourcesRow from './ResourcesRow';

// Note : using this as inspiration for the list: https://github.com/openshift-pipelines/console-plugin/blob/main/src/components/projects-list/ProjectsRow.tsx#L91

type ExampleProps = {
  namespace: string;
  showTitle?: boolean;
};

type ApplicationKind = K8sResourceKind & {
  spec?: {
    camelSpec: string;
  };
};

// TODO refactor => move somewhere else
const deploymentGVK = {
  group: 'apps',
  kind: 'Deployment',
  version: 'v1',
};
const deploymentConfigGVK = {
  group: 'apps.openshift.io',
  kind: 'DeploymentConfig',
  version: 'v1',
};
const cronJobGVK = {
  group: 'batch',
  kind: 'CronJob',
  version: 'v1',
};

const ExamplePage: React.FC<ExampleProps> = ({ namespace, showTitle = true }) => {
  const { t } = useTranslation('plugin__test-openshift-plugin');

  const [activeNamespace, setActiveNamespace] = useActiveNamespace();

  const filterResourcesNamespace = (activeNamespace: string): string => {
    return activeNamespace === '#ALL_NS#' ? '' : activeNamespace;
  };

  const watchedResources: WatchK8sResources<{
    deployments: ApplicationKind[];
    deploymentConfigs: ApplicationKind[];
    cronJobs: ApplicationKind[];
  }> = {
    deployments: {
      isList: true,
      groupVersionKind: deploymentGVK,
      namespaced: true,
      namespace: filterResourcesNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
    deploymentConfigs: {
      isList: true,
      groupVersionKind: deploymentConfigGVK,
      namespaced: true,
      namespace: filterResourcesNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
    cronJobs: {
      isList: true,
      groupVersionKind: cronJobGVK,
      namespaced: true,
      namespace: filterResourcesNamespace(activeNamespace),
      selector: {
        matchLabels: { ['camel/integration-runtime']: 'camel' },
      },
    },
  };

  const resources = useK8sWatchResources<{
    deployments: ApplicationKind[];
    deploymentConfigs: ApplicationKind[];
    cronJobs: ApplicationKind[];
  }>(watchedResources);


  const columns = useResourcesColumns(filterResourcesNamespace(activeNamespace));
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

  // {namespace => (namespace === "#ALL_NS#"? setActiveNamespace("all-namespaces"): setActiveNamespace(namespace))}

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
          Row={ResourcesRow}
          unfilteredData={staticData}
        />
      </ListPageBody>

    </>
  );
};

export default ExamplePage;
