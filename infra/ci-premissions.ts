'use strict';
import { Construct } from '@aws-cdk/core'
import { DeploymentPermissions, MiraApp } from 'mira'
import { PolicyStatement, Role} from '@aws-cdk/aws-iam'
import { MiraConfig } from 'mira'
export default class CustomPermissions extends DeploymentPermissions {
  constructor(parent: Construct) {
    super(parent)
    const account = MiraConfig.getEnvironment()
    const baseProject = MiraApp.getBaseStackName()
    this.role.addToPolicy(new PolicyStatement({
      actions: [
        '*'
      ],
      resources: [
        `*`
      ]
    }))
  }
}