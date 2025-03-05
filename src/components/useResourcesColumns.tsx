import { K8sResourceKind, TableColumn } from '@openshift-console/dynamic-plugin-sdk';
//import { sortable } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';

const useResourcesColumns = (): TableColumn<K8sResourceKind>[] => {
  const { t } = useTranslation('plugin__test-openshift-plugin');
  return [
    {
      title: t('Name'),
      id: 'name',
      sort: 'metadata.name',
      //transforms: [sortable],
    },
    {
      title: t('Kind'),
      id: 'kind',
      sort: 'kind',
      //transforms: [sortable],
    },
    {
      title: t('Namespace'),
      id: 'namespace',
      sort: 'metadata.namespace',
      //transforms: [sortable],
    },
    {
      title: t('Status'),
      id: 'status',
      sort: 'status.phase',
      //transforms: [sortable],
    },
    {
      title: t('Camel'),
      id: 'camel',
      sort: "metadata.annotations.['camel/camel-core-version']",
      //transforms: [sortable],
    },
    {
      title: t('Created'),
      id: 'created',
      sort: 'metadata.creationTimestamp',
      //transforms: [sortable],
    },
  ];
};

export default useResourcesColumns;
