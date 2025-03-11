
import * as React from 'react';
import { K8sResourceKind } from "@openshift-console/dynamic-plugin-sdk";

import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
//import { useTranslation } from "react-i18next";

const ResourceStatus = ({ resource }: { resource: K8sResourceKind }) => {
    // Use correct values for Succeded and Failed
    //const { t } = useTranslation('plugin__test-openshift-plugin');
  
    if (resource.kind == 'Deployment' || resource.kind == 'DeploymentConfig'){
        return <Status
        title={`${resource.status.availableReplicas} of ${resource.status.replicas} pods`}
        status={
            resource.status.availableReplicas === resource.status.replicas
            ? 'Succeeded'
            : 'Failed'
        }
      />
      } else if (resource.kind == 'CronJob'){
        return <Status
        title={`${resource.status.lastSuccessfulTime}`}
        status={resource.status.lastSuccessfulTime ? 'Succeeded' : 'Failed'}
      />
      }
  };

  export default ResourceStatus;