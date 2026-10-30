# Course resource access checks

Checked on 30 October 2026 using the resource list supplied by the learner. The table distinguishes a reachable public or sign-in page from authenticated access and course enrollment. No credentials, authentication query parameters, or private account screenshots are stored in this repository.

## Results

| Resource | Supplied URL | Observed result | Account access status / next step |
| --- | --- | --- | --- |
| GitHub repository | [Kzen07/epam](https://github.com/Kzen07/epam) | Public clone, push, matching remote commit, and successful validation workflow verified. GitHub associates the commits with Kzen07. | Confirmed for this repository. |
| University | [university.epam.com](https://university.epam.com/) | The in-app browser reached EPAM sign-in. Edge reached an account chooser; continuing with the supplied EPAM account led to an authentication-provider connection timeout, not a verified course page. | Authentication and learning-path enrollment not yet verified. Complete sign-in and inspect the assigned learning path. |
| Current learning path | No direct URL supplied | The list names the current course without an individual learning-path link. | Supply the course URL after sign-in; verify that its assignment and upload controls are available. |
| Learn | [learn.epam.com](https://learn.epam.com/) | Public Home page displayed Log in and Sign up links. | Public page reachable; authenticated learning access not verified. |
| Autocode | [autocode.git.epam.com](https://autocode.git.epam.com/) | Redirected to EPAM sign-in for Autocode. | Sign-in route reachable; assignment-checker rights not verified. |
| DIAL | [chat.lab.epam.com](https://chat.lab.epam.com/) | Redirected to Microsoft sign-in. | Authenticated chat and educational quota not verified. |
| CodeMie | [codemie.lab.epam.com](https://codemie.lab.epam.com/) | Displayed Welcome to CodeMie and Please, sign in to continue. | Sign-in page reachable; platform permissions not verified. |
| CodeMie training | [Learn course](https://learn.epam.com/catalog/detailsPage?id=8a946681-a483-4e3c-b079-00d150db9b08) | Redirected to EPAM sign-in. | Course access and enrollment not verified. |
| EliteA | [nexus.elitea.ai](https://nexus.elitea.ai/) | Browser reported ERR_NAME_NOT_RESOLVED. A separate local DNS lookup also reported that the name does not exist. | URL could not be reached from this environment. Confirm the supplied hostname with course administration; do not interpret this as a denied account entitlement. |
| EliteA training | [Learn course](https://learn.epam.com/catalog/detailsPage?id=b58085d7-a664-4c3a-8eb2-59cdbc2469ab) | Redirected to EPAM sign-in. | Course access and enrollment not verified. |
| LEAP | [leap.epam.com](https://leap.epam.com/) | Redirected to Microsoft sign-in. | Authenticated access not verified. |
| AIST | [aist.lab.epam.com](https://aist.lab.epam.com/) | Browser navigation timed out. A separate DNS lookup resolved the hostname. | Service reachability and account permissions remain inconclusive; retry through the normal course access route. |
| Video Portal | [Course channel](https://videoportal.epam.com/channel/DdYPoGza2X/videos) | Redirected to EPAM sign-in for Videoportal. | Channel visibility and video playback not verified. |
| GitHub Copilot | [Personal features settings](https://github.com/settings/copilot/features) | In the authenticated Edge session for Kzen07, the page displayed GitHub Copilot Free. No settings were changed. | Free plan visible; the course-provided educational license has not been confirmed. The resource instructions say licenses are provisioned by course administration without an individual request. |

## Interpretation and unresolved items

Most EPAM checks used an in-app browser without an authenticated EPAM session. University and Copilot were also inspected in Edge. A sign-in prompt shows that authentication is needed in that browser; it is not evidence that the learner's account lacks permission. Browser timeouts likewise do not prove that a service is down.

The resource-access requirement remains open until the authenticated checks are completed or any denied entitlements are reported to course administration. The specific current learning path has not been verified, and no assignment has been uploaded or submitted. Passwords, one-time codes, and session links should be entered only through the normal sign-in pages, not stored in the project.

The optional CodeMie or EliteA workflow has not been configured. The local graph build and GitHub Actions validation are implemented, but are not represented as completing an integration with either platform. No maximum score or license provision is claimed.
