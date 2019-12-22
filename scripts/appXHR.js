// Search Input
"use strict";

const src = document.getElementById("github-search");
const userphoto = document.querySelector(".github__photo");
const githubprofile = document.querySelector(".github__profile-button a");
const githubstats = document.querySelector(".github__right__top");
const githubnfo = document.querySelector(".github__right__mid");
const githubrepos = document.querySelector(".github__repos");
function githubFinder() {
  this.xhr = new XMLHttpRequest();
}

githubFinder.prototype.findUser = function(usr, callback) {
  const url = `https://api.github.com/users/${usr}`;
  this.xhr.open("GET", url, true);

  let self = this;
  this.xhr.onload = function() {
    if (self.xhr.status === 200) {
      callback(null, self.xhr.responseText);
    } else {
      callback("Error : " + self.xhr.status);
    }
  };
  this.xhr.send();
};

const setRepos = function(repos) {
  clear(githubrepos);
  console.log(">>", repos);

  repos.sort((a, b) => b.id - a.id);
  for (let i = 0; i < 4; i++) {
    const repodiv = document.createElement("div");
    repodiv.className = "github__repo";

    const repoLink = document.createElement("a");
    repoLink.textContent = repos[i].name;
    repoLink.setAttribute("href", repos[i].html_url);
    repoLink.setAttribute("target", "_blank");

    const repoStars = document.createElement("span");
    repoStars.textContent = `Stars: ${repos[i].stargazers_count}`;

    const repoWatchers = document.createElement("span");
    repoWatchers.textContent = `Watchers: ${repos[i].watchers_count}`;

    const repoForks = document.createElement("span");
    repoForks.textContent = `Forks: ${repos[i].forks_count}`;

    repodiv.appendChild(repoLink);
    repodiv.appendChild(repoStars);
    repodiv.appendChild(repoWatchers);
    repodiv.appendChild(repoForks);
    githubrepos.appendChild(repodiv);
  }

  //githubrepos;
};

githubFinder.prototype.getUserInfo = function(usr) {
  clear(userphoto);
  console.log(usr);
  // PROFILE LINK
  const userPhotoLink = usr.avatar_url;
  const profileLink = usr.html_url;
  githubprofile.setAttribute("href", profileLink);

  // PROFILE PHOTO
  this.setPhoto(userPhotoLink);

  //STATS
  this.setStats(
    usr.public_repos,
    usr.public_gists,
    usr.followers,
    usr.following
  );

  this.setNfo(usr.company, usr.blog, usr.location, usr.created_at);
  this.findRepos(usr.login, function(err, res) {
    //console.clear();
    if (err) {
      console.log(err);
    } else {
      setRepos(JSON.parse(res));
    }
  });
};

githubFinder.prototype.findRepos = function(usr, callback) {
  const url = `https://api.github.com/users/${usr}/repos`;
  this.xhr.open("GET", url, true);

  let self = this;
  this.xhr.onload = function() {
    if (self.xhr.status === 200) {
      callback(null, self.xhr.responseText);
    } else {
      callback("Error : " + self.xhr.status);
    }
  };
  this.xhr.send();
};

const clear = function(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  //userphoto.removeChild(userphoto.firstChild);
};

githubFinder.prototype.setPhoto = function(userPhotoLink) {
  const userImg = document.createElement("img");
  userImg.setAttribute("src", userPhotoLink);
  userphoto.appendChild(userImg);
};

githubFinder.prototype.setStats = function(pr, pg, fs, fg) {
  //Public repos, public gists, followers, following
  const userstats = githubstats.querySelectorAll(".github__stat span");
  userstats[0].textContent = pr ? pr : 0;
  userstats[1].textContent = pg ? pg : 0;
  userstats[2].textContent = fs ? fs : 0;
  userstats[3].textContent = fg ? fg : 0;
};

githubFinder.prototype.setNfo = function(company, website, location, memdate) {
  const userNfo = githubnfo.querySelectorAll(".github__nfo span");
  userNfo[0].textContent = company;
  userNfo[1].textContent = website;
  userNfo[2].textContent = location;
  userNfo[3].textContent = memdate;
};

const finder = new githubFinder();
finder.setStats();

document.addEventListener("keyup", () => {
  finder.findUser(src.value, function(err, res) {
    //console.clear();
    if (err) {
      console.log(err);
    } else {
      finder.getUserInfo(JSON.parse(res));
    }
  });
});
