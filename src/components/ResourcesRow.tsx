import {
  K8sResourceKind,
  ResourceIcon,
  RowProps,
  TableData,
  Timestamp,
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
//import _ from 'lodash';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom-v5-compat';
//import { formatNamespaceRoute } from '../pipelines-overview/utils';

const getKind = (obj) => obj.kind;
const getNamespace = (obj) => obj.metadata?.namespace;

const getCamelVersion = (obj: K8sResourceKind): string =>
  obj.metadata.annotations?.['camel/camel-core-version'];

// Check for a modified mouse event. For example - Ctrl + Click
const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

const ResourcesRow: React.FC<RowProps<K8sResourceKind>> = ({ obj: resource, activeColumnIDs }) => {
  const { t } = useTranslation('plugin__pipelines-console-plugin');
  const [, setActiveNamespace] = useActiveNamespace();
  const camelVersion = getCamelVersion(resource);

  const handleClick = (e) => {
    // Don't set last namespace if its modified click (Ctrl+Click).
    if (isModifiedEvent(e)) {
      return;
    }
    setActiveNamespace(resource.metadata.name);
  };

  const applicationUrl =
    '/camel/application/' +
    resource.metadata.namespace +
    '/' +
    resource.kind +
    '/' +
    resource.metadata.name;

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs}>
        <span className="co-resource-item co-resource-item--truncate">
          <ResourceIcon kind="DeploymentConfig" />
          <Link
            to={applicationUrl}
            className="co-resource-item__resource-name"
            onClick={handleClick}
          >
            {resource.metadata.name}
          </Link>
        </span>
      </TableData>
      <TableData id="kind" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          {getKind(resource) || <span className="text-muted">{t('No kind')}</span>}
        </span>
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          {getNamespace(resource) || <span className="text-muted">{t('No namespace')}</span>}
        </span>
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        <Status status={resource.status?.phase} />
      </TableData>
      <TableData id="camel" activeColumnIDs={activeColumnIDs}>
        {camelVersion || <span className="text-muted">{t('No camel version')}</span>}
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={resource.metadata.creationTimestamp} />
      </TableData>
    </>
  );
};

export default ResourcesRow;
