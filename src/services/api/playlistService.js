import mockPlaylists from '@/services/mockData/playlists.json'

class PlaylistService {
  constructor() {
    this.playlists = [...mockPlaylists]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.playlists]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const playlist = this.playlists.find(p => p.Id === id)
    if (!playlist) {
      throw new Error('Playlist not found')
    }
    return { ...playlist }
  }

  async create(playlistData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPlaylist = {
      ...playlistData,
      Id: Math.max(...this.playlists.map(p => p.Id)) + 1,
      videoIds: playlistData.videoIds || [],
      videoCount: playlistData.videoIds ? playlistData.videoIds.length : 0
    }
    this.playlists.push(newPlaylist)
    return { ...newPlaylist }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.playlists.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Playlist not found')
    }
    this.playlists[index] = { ...this.playlists[index], ...updateData }
    return { ...this.playlists[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.playlists.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Playlist not found')
    }
    this.playlists.splice(index, 1)
    return true
  }

  async addVideoToPlaylist(playlistId, videoId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const playlist = this.playlists.find(p => p.Id === playlistId)
    if (!playlist) {
      throw new Error('Playlist not found')
    }
    if (!playlist.videoIds.includes(videoId)) {
      playlist.videoIds.push(videoId)
      playlist.videoCount = playlist.videoIds.length
    }
    return { ...playlist }
  }

  async removeVideoFromPlaylist(playlistId, videoId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const playlist = this.playlists.find(p => p.Id === playlistId)
    if (!playlist) {
      throw new Error('Playlist not found')
    }
    playlist.videoIds = playlist.videoIds.filter(id => id !== videoId)
    playlist.videoCount = playlist.videoIds.length
    return { ...playlist }
  }
}

export const playlistService = new PlaylistService()