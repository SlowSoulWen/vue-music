import Home from '@/components/home/home'
import Songslist from '@/components/songslist/songslist'
import Player from '@/components/player/player'
import Comment from '@/components/comment/comment'
import Search from '@/components/search/search'
import Artists from '@/components/artists/artists'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Home
  },
  {
    path: '/songslist/:id',
    component: Songslist
  },
  {
    path: '/player/:id',
    component: Player
  },
  {
    path: '/player',
    component: Player
  },
  {
    path: '/comment/:type/:id',
    component: Comment
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/artists/:id',
    component: Artists
  }
]

  export default routes

