// Bicep template to deploy resources for the clinic demo
param resourceGroupName string = 'clinic-demo-rg'
param location string = resourceGroup().location
param swaName string = 'clinic-demo-web'
param functionName string = 'clinicDemoFunctions'
param sqlServerName string = 'clinicdemosql'
param sqlDbName string = 'clinicdb'
param openAiName string = 'clinic-demo-ai'

@secure()
param sqlAdminPassword string

param sqlAllowedIpRanges array = []
param sqlMinimalTlsVersion string = '1.2'

resource sqlServer 'Microsoft.Sql/servers@2021-02-01-preview' = {
  name: sqlServerName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    administratorLogin: 'sqladmin'
    administratorLoginPassword: sqlAdminPassword
    minimalTlsVersion: sqlMinimalTlsVersion
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlFirewallAzureServices 'Microsoft.Sql/servers/firewallRules@2021-02-01-preview' = {
  name: '${sqlServer.name}/AllowAzureServices'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource sqlFirewallCustomRules 'Microsoft.Sql/servers/firewallRules@2021-02-01-preview' = [for rule in sqlAllowedIpRanges: {
  name: '${sqlServer.name}/AllowIp${replace(replace(rule, '.', '-'), '/', '-') }'
  parent: sqlServer
  properties: {
    startIpAddress: rule
    endIpAddress: rule
  }
}]

resource sqlSecurityAlert 'Microsoft.Sql/servers/securityAlertPolicies@2021-02-01-preview' = {
  parent: sqlServer
  name: 'Default'
  properties: {
    state: 'Enabled'
    emailAccountAdmins: true
  }
}

resource sqlThreatProtection 'Microsoft.Sql/servers/advancedThreatProtectionSettings@2021-02-01-preview' = {
  parent: sqlServer
  name: 'Default'
  properties: {
    state: 'Enabled'
    emailAccountAdmins: true
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2021-02-01-preview' = {
  name: sqlDbName
  parent: sqlServer
  properties: {
    sku: {
      name: 'Basic'
    }
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${functionName}-plan'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
  }
  kind: 'functionapp'
}

resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: functionName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
      ]
    }
  }
}

// Application Insights for monitoring
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${functionName}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

resource staticWebApp 'Microsoft.Web/staticSites@2021-03-01' = {
  name: swaName
  location: location
  properties: {
    repositoryToken: ''
    buildProperties: {}
  }
}

resource openAi 'Microsoft.CognitiveServices/accounts@2021-04-30' = {
  name: openAiName
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'F0'
  }
  properties: {}
}

output sqlAdmin string = sqlServer.properties.administratorLogin
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output functionAppUrl string = functionApp.properties.defaultHostName
output healthCheckUrl string = 'https://${functionApp.properties.defaultHostName}/api/health'
