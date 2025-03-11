import {
  getGroupVersionKindForResource,
  K8sResourceKind,
  ResourceLink,
  RowProps,
  TableData,
  Timestamp,
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom-v5-compat';
import ResourceStatus from './ResourceStatus';

const getKind = (obj) => obj.kind;
const getNamespace = (obj) => obj.metadata?.namespace;

const getCamelVersion = (obj: K8sResourceKind): string =>
  obj.metadata.annotations?.['camel/camel-core-version'];


// Check for a modified mouse event. For example - Ctrl + Click
const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

const ResourcesRow: React.FC<RowProps<K8sResourceKind>> = ({ obj: resource, activeColumnIDs }) => {
  const { t } = useTranslation('plugin__test-openshift-plugin');
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
          <ResourceLink
            displayName={getKind(resource)}
            groupVersionKind={getGroupVersionKindForResource(resource)}
            name={resource.metadata.name}
            namespace={resource.metadata.namespace}
          />
        </span>
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          {getNamespace(resource) || <span className="text-muted">{t('No namespace')}</span>}
        </span>
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        <ResourceStatus resource={resource}/>
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
