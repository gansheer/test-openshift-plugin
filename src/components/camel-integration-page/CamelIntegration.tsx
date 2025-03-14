import * as React from 'react';
import { Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom-v5-compat';
import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';
import { useGetCamelIntegration } from './useGetCamelIntegration';
//import { useTranslation } from 'react-i18next';
import { useCamelIntegrationTabs } from './useCamelIntegrationTabs';


const CamelIntegration: React.FC = () => {
  //const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  console.log("+++CamelIntegration");
  const { ns: namespace, name, kind } = useParams<{
    ns?: string;
    name?: string;
    kind?: string;
  }>();


  const { camelIntegration, isLoading, error } = useGetCamelIntegration(name, namespace, kind);

  // TODO: manage errors
  console.log(">>>camelIntegration " + camelIntegration);
  console.log(">>>isLoading " + isLoading);
  console.log(">>>error " + error);

  const pages = useCamelIntegrationTabs(camelIntegration);

  // Needs a useEffect or something like that

  if (!isLoading) {
    return <>Wait for it <Spinner aria-label="Loading applicaton details" /></>;
  }

  if (error) {
    return <>Nope</>
  }


  return (<>
    Do the thing
    <HorizontalNav pages={pages} />

  </>);
};

export default CamelIntegration;