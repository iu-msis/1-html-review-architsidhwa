const Offer = {
    data() {
      return {
        result: undefined,
        app: 0,
        books: [],
        bookForm: {},
        selectedBook: null
      }
    },
    computed: {
        prettyBirthday() {
            return dayjs(this.person.dob.date)
            .format('D MMM YYYY');
        }
    },
    methods: {
        fetchUserData() {
            fetch('https://randomuser.me/api/')
            .then(response => response.json())
            .then((parsedJson) => {
                console.log(parsedJson);
                this.person = parsedJson.results[0]
                console.log("C");
            })
            .catch( err => {
                console.error(err)
            })

            console.log("B");
        },

        fetchBookData() {
            console.log("Fetching Book data");
            fetch('/api/book/')
            .then(response => response.json())
            .then((parsedJson) => {
                //console.log(parsedJson);
                this.books = parsedJson;
            })
            .catch( err => {
                console.error(err)
            })
        },
        postBook(b) {
            if (this.selectedBook === null) {
                this.postNewBook(b);
            } else {
                this.postEditBook(b);
            }
          },

        postNewBook(evt){
          console.log("Creating!", this.bookForm);

          fetch('api/create.php',{
              method:'POST',
              body: JSON.stringify(this.bookForm),
              headers:{
                  "Content-Type": "application/json; charset=utf-8"
              }
          })
          .then( response => response.json() )
          .then( json => {
              console.log("Returned from post:", json);
              this.books = json;
              this.bookForm = {};
              this.handleResetEdit();
          });          
      }, 
      postEditBook(evt) {
        fetch('api/book/update.php', {
            method:'POST',
            body: JSON.stringify(this.bookForm),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          .then( response => response.json() )
          .then( json => {
            console.log("Returned from post:", json);
            // TODO: test a result was returned!
            this.books = json;
            
            // reset the form
            this.resetBookForm();
          });
      },

        postDeleteBook(o) {  
          if ( !confirm("Are you sure you want to delete the book " + o.Title + "?") ) {
              return;
          }  
          
          console.log("Delete!", o);

          fetch('api/book/delete.php', {
              method:'POST',
              body: JSON.stringify(o),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.books = json;
              
              // reset the form
              this.resetBookForm();
            });
        },

       handleResetEdit() {  
          this.selectedBook = null;
          this.bookForm = {};
      },
        handleEditBook(book) {
          this.selectedBook = book;
          this.bookForm = Object.assign({}, this.selectedBook);
    },
        selectBook(o) {
          if (o == this.selectedBook) {
              return;
          }
          this.selectedBook = o;
          this.books = [];
          this.fetchBooksData(this.selectedBook);
  },
        postBook(evt) {
            console.log ("Test:", this.selectedBook);
          if (this.selectedBook) {
              this.postEditBook(evt);
          } else {
              this.postNewBook(evt);
          }
        },
        resetBookForm() {
            this.selectedBook = null;
            this.bookForm = {};
        }

    },
    created() {
        this.fetchUserData();
        this.fetchBookData();
    }
  }
  
Vue.createApp(Offer).mount('#offerApp');