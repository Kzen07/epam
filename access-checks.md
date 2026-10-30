# Course resource access checks

Checked on 30 October 2026 using the resource list supplied by the learner. The learner subsequently confirmed that only AIST and the EliteA platform do not open; the other listed resources open. The table keeps those learner-reported results separate from direct browser observations. No credentials, authentication query parameters, or private account screenshots are stored in this repository.

## Results

| Resource | Supplied URL | Observed result | Account access status / next step |
| --- | --- | --- | --- |
| GitHub repository | [Kzen07/epam](https://github.com/Kzen07/epam) | Public clone, push, matching remote commit, and successful validation workflow verified. GitHub associates the commits with Kzen07. | Confirmed for this repository. |
| University | [university.epam.com](https://university.epam.com/) | The in-app browser reached EPAM sign-in. An Edge sign-in attempt timed out at the authentication provider. | Learner reports the resource opens in their own session. This report does not claim an independent inspection of course enrollment. |
| Current learning path | No direct URL supplied | The course was named in the resource list without an individual link. | Covered by the learner's general confirmation that the other listed resources open; assignment and upload controls have not been independently inspected. No additional course URL is required for this access report. |
| Learn | [learn.epam.com](https://learn.epam.com/) | Public Home page displayed Log in and Sign up links. | Learner reports the resource opens. |
| Autocode | [autocode.git.epam.com](https://autocode.git.epam.com/) | Redirected to EPAM sign-in for Autocode. | Learner reports the resource opens; no practical task was submitted to the checker. |
| DIAL | [chat.lab.epam.com](https://chat.lab.epam.com/) | Redirected to Microsoft sign-in. | Learner reports the resource opens; quota and model availability were not independently measured. |
| CodeMie | [codemie.lab.epam.com](https://codemie.lab.epam.com/) | Displayed Welcome to CodeMie and Please, sign in to continue. | Learner reports the resource opens. It is the available alternative to the unreachable EliteA platform. |
| CodeMie training | [Learn course](https://learn.epam.com/catalog/detailsPage?id=8a946681-a483-4e3c-b079-00d150db9b08) | Redirected to EPAM sign-in. | Learner reports that the other listed resources, including training links, open; course completion is not claimed. |
| EliteA | [nexus.elitea.ai](https://nexus.elitea.ai/) | Browser reported ERR_NAME_NOT_RESOLVED. A separate local DNS lookup also reported that the name does not exist. | Learner confirms this platform does not open. Issue documented; confirm the supplied hostname with course administration if this platform is needed. This is not proof of a denied account entitlement. |
| EliteA training | [Learn course](https://learn.epam.com/catalog/detailsPage?id=b58085d7-a664-4c3a-8eb2-59cdbc2469ab) | Redirected to EPAM sign-in. | Included in the learner's general confirmation of other resources opening. This training link is separate from the unavailable EliteA platform; course completion is not claimed. |
| LEAP | [leap.epam.com](https://leap.epam.com/) | Redirected to Microsoft sign-in. | Learner reports the resource opens. |
| AIST | [aist.lab.epam.com](https://aist.lab.epam.com/) | Browser navigation timed out. A separate DNS lookup resolved the hostname. | Learner confirms this platform does not open. Issue documented; the cause has not been established. |
| Video Portal | [Course channel](https://videoportal.epam.com/channel/DdYPoGza2X/videos) | Redirected to EPAM sign-in for Videoportal. | Learner reports the resource opens; no separate playback test was independently performed. |
| GitHub Copilot | [Personal features settings](https://github.com/settings/copilot/features) | In the authenticated Edge session for Kzen07, the page displayed GitHub Copilot Free. No settings were changed. | Free plan visible; the course-provided educational license has not been confirmed. The resource instructions say licenses are provisioned by course administration without an individual request. |

## Interpretation and unresolved items

Most EPAM checks used an in-app browser without an authenticated EPAM session. University and Copilot were also inspected in Edge. A sign-in prompt shows that authentication is needed in that browser; it is not evidence that the learner's account lacks permission. Browser timeouts likewise do not prove that a service is down.

The resource check has been documented using direct observations and the learner's confirmation. The two learner-reported unavailable platforms are AIST and EliteA. The separate Copilot observation remains Free; opening its settings page does not establish that the educational license has been provisioned. These issues are recorded before submission. No message has been sent to course administration, and no assignment has been uploaded or submitted.

The exact learning path and its upload controls have not been independently inspected. The learner's confirmation of access is accepted for this report without requiring another login or course URL. Passwords, one-time codes, and session links belong only in the normal sign-in pages, not in the project.

The optional CodeMie or EliteA workflow has not been configured. The local graph build and GitHub Actions validation are implemented, but are not represented as completing an integration with either platform. No maximum score or license provision is claimed.
