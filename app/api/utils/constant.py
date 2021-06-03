CREATE_GENERAL_USER_MUTATION = '''
       mutation createGeneralUser($nickname: String!, $email: String!, $password: String!) {
           createGeneralUser(input: { nickname: $nickname, email: $email, password: $password }) {
               user {
                   id
               }
           }
       }
   '''

CREATE_GUEST_USER_MUTATION = '''
       mutation createGuestUser($password: String!) {
           createGuestUser(input: { password: $password }) {
               user {
                   id
               }
           }
       }
   '''

DELETE_USER_MUTATION = '''
       mutation deleteUser($confirm: Boolean!) {
           deleteUser(input: { confirm: $confirm }) {
               user {
                   id
               }
           }
       }
   '''