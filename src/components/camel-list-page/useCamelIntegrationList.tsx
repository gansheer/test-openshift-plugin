import { useK8sWatchResources } from '@openshift-console/dynamic-plugin-sdk';
import { CamelIntegrationKind } from '../../types';
import {
  cronJobGVK,
  deploymentConfigGVK,
  deploymentGVK,
  METADATA_LABEL_SELECTOR_CAMEL_APP_KEY,
  METADATA_LABEL_SELECTOR_CAMEL_APP_VALUE,
} from '../../const';

export const useCamelIntegrationList = (
  namespace: string,
): { camelIntegrations: CamelIntegrationKind[]; loaded: boolean; error: string } => {
  const resources = useK8sWatchResources<{
    deployments: CamelIntegrationKind[];
    deploymentConfigs: CamelIntegrationKind[];
    cronJobs: CamelIntegrationKind[];
  }>({
    deployments: {
      isList: true,
      groupVersionKind: deploymentGVK,
      namespaced: true,
      namespace: namespace,
      selector: {
        matchLabels: {
          [METADATA_LABEL_SELECTOR_CAMEL_APP_KEY]: METADATA_LABEL_SELECTOR_CAMEL_APP_VALUE,
        },
      },
    },
    deploymentConfigs: {
      isList: true,
      groupVersionKind: deploymentConfigGVK,
      namespaced: true,
      namespace: namespace,
      selector: {
        matchLabels: {
          [METADATA_LABEL_SELECTOR_CAMEL_APP_KEY]: METADATA_LABEL_SELECTOR_CAMEL_APP_VALUE,
        },
      },
    },
    cronJobs: {
      isList: true,
      groupVersionKind: cronJobGVK,
      namespaced: true,
      namespace: namespace,
      selector: {
        matchLabels: {
          [METADATA_LABEL_SELECTOR_CAMEL_APP_KEY]: METADATA_LABEL_SELECTOR_CAMEL_APP_VALUE,
        },
      },
    },
  });

  const resourcesData = [
    ...resources.deploymentConfigs.data,
    ...resources.deployments.data,
    ...resources.cronJobs.data,
  ];

  const resourcesLoaded =
    resources.deploymentConfigs.loaded && resources.deployments.loaded && resources.cronJobs.loaded;

  const resourcesLoadError =
    resources.deploymentConfigs.loadError +
    resources.deployments.loadError +
    resources.cronJobs.loadError;

  return { camelIntegrations: resourcesData, loaded: resourcesLoaded, error: resourcesLoadError };
};
