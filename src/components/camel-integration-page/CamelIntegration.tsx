import * as React from 'react';
import { Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom-v5-compat';
import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';
import { useCamelIntegration } from './useGetCamelIntegration';
//import { useTranslation } from 'react-i18next';
import { useCamelIntegrationTabs } from './useCamelIntegrationTabs';


const CamelIntegration: React.FC = () => {
  //const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  const { ns: namespace, name, kind } = useParams<{
    ns?: string;
    name?: string;
    kind?: string;
  }>();


  const { camelIntegration, isLoading, error } = useCamelIntegration(name, namespace, kind);

  const pages = useCamelIntegrationTabs(camelIntegration);

  // TODO A common loading spinner component
  if (isLoading) {
    return <><Spinner aria-label="Loading applicaton details" /></>;
  }

  // TODO A common error component
  if (error) {
    return <>error</>
  }


  return (<>
    <HorizontalNav pages={pages} />

  </>);
};

export default CamelIntegration;