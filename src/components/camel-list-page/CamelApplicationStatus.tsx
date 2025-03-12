import * as React from 'react';
import { K8sResourceKind } from "@openshift-console/dynamic-plugin-sdk";

import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
//import { useTranslation } from "react-i18next";

const CamelApplicationStatus = ({ camelApp }: { camelApp: K8sResourceKind }) => {
    // Use translated values for Succeded and Failed
    //const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  
    if (camelApp.kind == 'Deployment' || camelApp.kind == 'DeploymentConfig'){
        return <Status
        title={`${camelApp.status.availableReplicas} of ${camelApp.status.replicas} pods`}
        status={
          camelApp.status.availableReplicas === camelApp.status.replicas
            ? 'Succeeded'
            : 'Failed'
        }
      />
      } else if (camelApp.kind == 'CronJob'){
        return <Status
        title={`${camelApp.status.lastSuccessfulTime}`}
        status={camelApp.status.lastSuccessfulTime ? 'Succeeded' : 'Failed'}
      />
      }
  };

  export default CamelApplicationStatus;