import mockVideos from '@/services/mockData/videos.json'

class VideoService {
  constructor() {
    this.videos = [...mockVideos]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.videos]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const video = this.videos.find(v => v.Id === id)
    if (!video) {
      throw new Error('Video not found')
    }
    return { ...video }
  }

  async create(videoData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newVideo = {
      ...videoData,
      Id: Math.max(...this.videos.map(v => v.Id)) + 1,
      uploadDate: new Date().toISOString(),
      views: 0,
      likes: 0,
      dislikes: 0
    }
    this.videos.push(newVideo)
    return { ...newVideo }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.videos.findIndex(v => v.Id === id)
    if (index === -1) {
      throw new Error('Video not found')
    }
    this.videos[index] = { ...this.videos[index], ...updateData }
    return { ...this.videos[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.videos.findIndex(v => v.Id === id)
    if (index === -1) {
      throw new Error('Video not found')
    }
    this.videos.splice(index, 1)
    return true
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const searchTerm = query.toLowerCase()
    return this.videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm) ||
      video.description.toLowerCase().includes(searchTerm) ||
      video.channelName.toLowerCase().includes(searchTerm)
    )
  }
}

export const videoService = new VideoService()