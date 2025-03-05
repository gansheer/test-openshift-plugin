import * as React from 'react';
import Helmet from 'react-helmet';
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
import {
  Card,
  CardBody,
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
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

  console.log('>>>>resources<<<<');
  console.log(resources);

  const columns = useResourcesColumns();
  const resourcesData = [
    ...resources.deploymentConfigs.data,
    ...resources.deployments.data,
    ...resources.cronJobs.data,
  ];
  console.log('>>>>data<<<<');
  console.log(resourcesData);
  const [staticData, filteredData, onFilterChange] = useListPageFilter(resourcesData);

  const resourcesLoaded =
    resources.deploymentConfigs.loaded && resources.deployments.loaded && resources.cronJobs.loaded;
  const resourcesLoadError =
    resources.deploymentConfigs.loadError +
    resources.deployments.loadError +
    resources.cronJobs.loadError;

  // {namespace => (namespace === "#ALL_NS#"? setActiveNamespace("all-namespaces"): setActiveNamespace(namespace))}

  return (
    <>
      <NamespaceBar onNamespaceChange={setActiveNamespace} />
      <Helmet>
        <title data-test="example-page-title">{t('Hello, Plugin!')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Hello, Plugin!')}</Title>
        </PageSection>
        <PageSection variant="light">
          <Card>
            <CardBody>
              <ListPageHeader title={'bleah'} />

              <ListPageBody></ListPageBody>

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

              <TextContent>
                <Text component="p">
                  <span className="test-openshift-plugin__nice">
                    <CheckCircleIcon /> {t('Success!')}
                  </span>{' '}
                  {t('Your plugin is working.')}
                </Text>
                <Text component="p">
                  Namespace used: <b>{activeNamespace}</b>
                </Text>
              </TextContent>
            </CardBody>
          </Card>
        </PageSection>

        <PageSection variant="light">
          <TextContent>
            <Text component="p">
              {t(
                'This is a custom page contributed by the console plugin template. The extension that adds the page is declared in console-extensions.json in the project root along with the corresponding nav item. Update console-extensions.json to change or add extensions. Code references in console-extensions.json must have a corresponding property',
              )}
              <code>{t('exposedModules')}</code>{' '}
              {t('in package.json mapping the reference to the module.')}
            </Text>
            <Text component="p">
              {t('After cloning this project, replace references to')}{' '}
              <code>{t('test-openshift-plugin')}</code>{' '}
              {t('and other plugin metadata in package.json with values for your plugin.')}
            </Text>
          </TextContent>
        </PageSection>
      </Page>
    </>
  );
};

export default ExamplePage;
