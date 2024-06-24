import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDAzCCAeugAwIBAgIJDzGkMPZEC0zYMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV
BAMTFGJhcm9ubmcudXMuYXV0aDAuY29tMB4XDTI0MDYwNDA0MzYwM1oXDTM4MDIx
MTA0MzYwM1owHzEdMBsGA1UEAxMUYmFyb25uZy51cy5hdXRoMC5jb20wggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCI4kslced3yNO4iNMBT0YxBDfaSoZJ
npSpsFZvEMNTGc2ZrfmMO0OEz5V8eHazZvO9WbtQM4mAzIVbw22pZd7ov+w4GalZ
lgI0DWRD8pXYUyjbp3d8JwRqjfH+/uXaT5LDKty5sAsaXI1dN9YgT3V4aCDadILS
2jlGxuy0upaoPATbPmOKrHbaC0jWxzC4/I/ScerMpa1HuNTR+/JrWsmr6+zXRumU
Ik/HYfzjBY8PE8t4D0kljE0R777wLKUxvuPn3Pllo11or4ytZeoy9BCSs3oA9VyK
/NN/iAU4wXydWJ1l3nrxWiuKvZbyxXIt2/DnWEQYeJ0KeTpcLjqxvzidAgMBAAGj
QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFBemeNKeo7339wbmimZJ+xxu
GtwQMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAgLn0NfZg/hHe
A+Khr01NqiNLVkn54zIRCov+tsmkn2LOYUTw61hFhbj+muiOq/emVEc8dej6poeK
ruGoycqp9sjGmYC5Qc8VP7Jpqwsnet8EBXSam6eg5mu69JDArTrVwV8ZXtHofuZw
WYLYRKOtD1yBhyfHKImnUAaWX42oqvLj+SszhpeTv+1p5CMmjsyGCCB3TG3IfPSD
sKb805RKaVoQegi3ett35Xe3e4PvSyYPvCM3Fc7HEL6iqr0mxx/mWYTznsjoVPdV
EKUpEuDVkzQnTCSymKl2t1jXcHpOasEjryjOS4q1UzFPu4afXdmjRjWije+fC85H
OA3X+SueMg==
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
