// Search Input 
const src = document.getElementById('github-search')
const userphoto = document.querySelector('.github__photo')





function githubFinder() {
  this.xhr = new XMLHttpRequest()
}



githubFinder.prototype.findUser = function(usr, callback) {  
  const url =`https://api.github.com/users/${usr}`
  this.xhr.open('GET', url, true)

  let self = this  
  this.xhr.onload = function () {
    if (self.xhr.status === 200) {
      callback(null,self.xhr.responseText)
      
    } else {
      callback('Error : '+self.xhr.status)
    }
  }
  this.xhr.send()    
}


githubFinder.prototype.getUserInfo = function (usr) { }




const finder = new githubFinder()






document.addEventListener('keyup', () => {  
  finder.findUser(src.value, function (err, res) {
    if (err) {
      console.log(err)      
    } else {
      console.log(res)      
    }    
  })
})











