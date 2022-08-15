// ******************************************************************************************
//Selectors
export const cookieSettingsPopup = '.consentForm__root';
export const confirmAllCookies = 'Alle auswählen & bestätigen';
export const firstName = '#firstName';
export const lastName = '#lastName';
export const emailAddress = '#email';
export const password = '#password';
export const repeatPassword = '#password2';
export const newsletter = '.accountNew__newsletterCheckbox';
export const terms = 'Ja, ich stimme';
export const newAccount = '#registerAccount';
export const submitAccount = '#register-submit';
export const loginHeaderText = '.headerElement--login';
export const loginHeaderLink = '.headerElement__link--login';
export const loginEmail = '#loginEmail';
export const loginPassword = '#loginPassword';
export const submitLogin = '#login-submit';
export const forgotPasswordLink = '.existingAccount__forgotten';
export const forgottenEmail = '#passwordForgottenEmail';
export const submitResetPasswordRequest = '#passwordForgottenSubmitId';
export const checkMailboxMessage = '.checkMailbox__text--green';
export const newResetPassword = '#newPassword';
export const repeatNewResetPassword = '#newPasswordRepeat';
export const submitResetPassword = '#passwordNewSubmit';
export const loginFormHeader = '.existingAccount__headline';
export const accountHeader = '.headerBrand__element--login';
export const userName ='.headerElement__status--login';
export const invalidCredentialsMessage = '#loginEmail-error';

// ******************************************************************************************
//Methods
//To create a random string
export const randomString = (stringLength) => {
  let randomString = '';
  const alpha = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < stringLength; i++) {
    randomString += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }

  return randomString.charAt(0).toUpperCase() + randomString.slice(1);
}

// ******************************************************************************************
//To create a random email
export const randomEmail = (stringLength, domain = '@email.com') => {
  let randomEmail = '';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i <= stringLength; i++) {
    randomEmail += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }

  return randomEmail += domain;
}

// ******************************************************************************************
//To create a random password
export const randomPassword = (stringLength) => {
  let randomPassword = '';
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const numeric = '0123456789';
  const symbols = ',.:;~!?$%^&*-_+=';

  for (let i = 0; i <= stringLength; i++) {
    randomPassword += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }
  
  randomPassword = randomPassword.charAt(0).toUpperCase() + randomPassword.slice(1);
  randomPassword += numeric.charAt(Math.floor(Math.random() * numeric.length));
  randomPassword += symbols.charAt(Math.floor(Math.random() * numeric.length));
  return randomPassword;
}

// ******************************************************************************************
//Navigate to Registration page
export const navigateToRegistration = () => {
  cy.visit(Cypress.env('baseUrl')+'/login');
  //cy.confirmCookies();

  cy.get(newAccount).click({force: true});
  cy.url().should('include','registrierung');
}

// ******************************************************************************************
//Register a new account
export const registerAccount = (email, newPassword, newFirstName, newLastName) => {
  cy.get(firstName).type(newFirstName);
  cy.get(lastName).type(newLastName);
  cy.get(emailAddress).type(email);
  cy.get(password).type(newPassword);
  cy.get(repeatPassword).type(newPassword);  
  cy.get(newsletter).click();
  cy.contains(terms).click({force:true}); 
  cy.get(submitAccount).click();

  cy.wait(3000);
  cy.get(loginHeaderText).contains('Dein Konto');
}

// ******************************************************************************************
//To request password reset
export const passwordResetRequest = (testEmail) => {
  //cy.confirmCookies();
  cy.get(forgotPasswordLink).click({force: true});
  cy.get(forgottenEmail).type(testEmail);
  cy.get(submitResetPasswordRequest).click();
  cy.contains('Du hast Dein Passwort vergessen');
  cy.get(checkMailboxMessage).contains('Eine E-Mail mit den Anweisungen, um Dein Passwort zurückzusetzen wurde an Dich verschickt.');
}

// ******************************************************************************************
//Set new password
export const setNewPassword = (resetPassword) => {
  cy.get(newResetPassword).type(resetPassword);
  cy.get(repeatNewResetPassword).type(resetPassword);
  cy.get(submitResetPassword).click();
}

// ******************************************************************************************
//Get Email from Mailosaur inbox
export function getEmailId(receivedAfter, serverId) {
  let emailId;
  let passwordResetLink;

  cy.request({
    method: 'GET',
    url: `https://mailosaur.com/api/messages?receivedAfter=${receivedAfter}&server=${serverId}`, 
    failOnStatusCode: false,
      auth: {
      username: Cypress.env('MAILOSAUR_API_KEY'),
      password: ''
    },
    headers: {
      authorization: `Basic ${Cypress.env('MAILOSAUR_API_KEY')}`  
    }
  }).then(response => { 
      response = JSON.stringify(response);  
      console.log(response);

      const responseObject = JSON.parse(response);
      console.log(responseObject); 

      if (responseObject.body.items.length == 0) {
          cy.wait(15000);           
          getEmailId(receivedAfter, serverId);                
        } else {
          console.log(responseObject.body.items[0].id);
          emailId = `${responseObject.body.items[0].id}`;   
          cy.log(emailId);
          console.log(emailId);   
        }          
});

    cy.request({
      method: 'GET',
      url: `https://mailosaur.com/api/messages/${emailId}`, 
        auth: {
        username: Cypress.env('MAILOSAUR_API_KEY'),
        password: ''
      },
      headers: {
        authorization: `Basic ${Cypress.env('MAILOSAUR_API_KEY')}`
      } 
    }).then(response => {
        passwordResetLink = response.body.html.links[5];
        console.log(response);
        console.log(response.body.html.links[5]);
        console.log(passwordResetLink);    
        //expect(response.body.subject).to.equal('Passwort zurücksetzen');   
      });
  
  return passwordResetLink;
}

