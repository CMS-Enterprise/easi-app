# Rotate Okta Test Password

## Context

The account that we use for E2E login tests is a real Okta account on the [Test Okta Server](https://test.idp.idm.cms.gov). About 2 months after the password was last changed, logins with this account will start to warn you that the password is about to expire, which breaks our E2E test suite (as it doesn't expect this pop-up).

## Steps to reset the password

1. Log into the [Test Okta Server](https://test.idp.idm.cms.gov) with the shared account.
    - The shared account can be found in [this entry in 1Password](https://start.1password.com/open/i?a=RYAMO7WYSJHNNCGOFE3Q2TVVUE&v=j3plnuuwh2alqm5hw3pp65afza&i=ruraota4e6rkgo4cxzpgcggwya&h=cmseasi.1password.com).
2. Click on the dropdown in the top right, and select "Settings"
3. In the "Change Password" section, set the new password to a securely generated one (you can use 1Password to make one).
    - In 1Password, set the settings to be "Random Password" of length 16, and include symbols and numbers.
	- Make sure the new password is saved in 1Password before you edit it in Okta or GitHub.
4. [Update the OKTA_TEST_PASSWORD secret in GitHub](https://github.com/cms-enterprise/easi-app/settings/secrets/actions/OKTA_TEST_PASSWORD) to the new password.
5. [Update the OKTA_TEST_PASSWORD dependabot secret in GitHub](https://github.com/cms-enterprise/easi-app/settings/secrets/dependabot/OKTA_TEST_PASSWORD) to the new password.
6. Thread a response to the monthly reminder in the [#oit-easi-dev](https://cmsgov.slack.com/archives/CNU2B59UH) slack channel that the password has successfully been updated.
