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
  import { Link } from 'react-router-dom';
  import CamelApplicationStatus from './CamelApplicationStatus';
  
  const getKind = (obj) => obj.kind;
  const getNamespace = (obj) => obj.metadata?.namespace;
  
  const getCamelVersion = (obj: K8sResourceKind): string =>
    obj.metadata.annotations?.['camel/camel-core-version'];
  
  
  // Check for a modified mouse event. For example - Ctrl + Click
  const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  };
  
  const ResourcesRow: React.FC<RowProps<K8sResourceKind>> = ({ obj: camelApp, activeColumnIDs }) => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');
    const [, setActiveNamespace] = useActiveNamespace();
    const camelVersion = getCamelVersion(camelApp);
    
  
    const handleClick = (e) => {
      // Don't set last namespace if its modified click (Ctrl+Click).
      if (isModifiedEvent(e)) {
        return;
      }
      setActiveNamespace(camelApp.metadata.name);
    };
    
    return (
      <>
        <TableData id="name" activeColumnIDs={activeColumnIDs}>
          <span className="co-resource-item co-resource-item--truncate">
            <span className="co-m-resource-icon co-m-resource-camelapplication" title="CamelApplication">C</span>
            <Link
              to={`/camel/application/ns/${camelApp.metadata.namespace}/kind/${camelApp.kind}/name/${camelApp.metadata.name}`}
              className="co-resource-item__resource-name"
              title={camelApp.metadata.name}
              onClick={handleClick}
            >
              {camelApp.metadata.name}
            </Link>
          </span>
        </TableData>
        <TableData id="kind" activeColumnIDs={activeColumnIDs}>
          <span className="co-break-word co-line-clamp">
            <ResourceLink
              displayName={getKind(camelApp)}
              groupVersionKind={getGroupVersionKindForResource(camelApp)}
              name={camelApp.metadata.name}
              namespace={camelApp.metadata.namespace}
            />
          </span>
        </TableData>
        <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
          <span className="co-break-word co-line-clamp">
            {getNamespace(camelApp) || <span className="text-muted">{t('No namespace')}</span>}
          </span>
        </TableData>
        <TableData id="status" activeColumnIDs={activeColumnIDs}>
          <CamelApplicationStatus camelApp={camelApp}/>
        </TableData>
        <TableData id="camel" activeColumnIDs={activeColumnIDs}>
          {camelVersion || <span className="text-muted">{t('No camel version')}</span>}
        </TableData>
        <TableData id="created" activeColumnIDs={activeColumnIDs}>
          <Timestamp timestamp={camelApp.metadata.creationTimestamp} />
        </TableData>
      </>
    );
  };
  
  export default ResourcesRow;