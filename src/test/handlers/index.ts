import { authHandlers } from './auth.handlers'
import { servicesHandlers } from './services.handlers'
import { ssoHandlers } from './sso.handlers'
import { subscriptionHandlers } from './subscription.handlers'
import { billingHandlers } from './billing.handlers'
import { teamHandlers } from './team.handlers'
import { notificationsHandlers } from './notifications.handlers'
import { referralsHandlers } from './referrals.handlers'
import { supportHandlers } from './support.handlers'

export const handlers = [
  ...authHandlers,
  ...servicesHandlers,
  ...ssoHandlers,
  ...subscriptionHandlers,
  ...billingHandlers,
  ...teamHandlers,
  ...notificationsHandlers,
  ...referralsHandlers,
  ...supportHandlers,
]
