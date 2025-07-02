import mockChannels from '@/services/mockData/channels.json'

class ChannelService {
  constructor() {
    this.channels = [...mockChannels]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.channels]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const channel = this.channels.find(c => c.Id === id)
    if (!channel) {
      throw new Error('Channel not found')
    }
    return { ...channel }
  }

  async create(channelData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newChannel = {
      ...channelData,
      Id: Math.max(...this.channels.map(c => c.Id)) + 1,
      subscribers: 0
    }
    this.channels.push(newChannel)
    return { ...newChannel }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.channels.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Channel not found')
    }
    this.channels[index] = { ...this.channels[index], ...updateData }
    return { ...this.channels[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.channels.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Channel not found')
    }
    this.channels.splice(index, 1)
    return true
  }
}

export const channelService = new ChannelService()