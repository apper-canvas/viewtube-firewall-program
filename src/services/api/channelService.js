import { toast } from 'react-toastify'

class ChannelService {
  constructor() {
    this.tableName = 'channel'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "avatar" } },
          { field: { Name: "subscribers" } }
        ],
        orderBy: [
          { fieldName: "subscribers", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching channels:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(recordId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "avatar" } },
          { field: { Name: "subscribers" } }
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching channel with ID ${recordId}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(channelData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields
      const updateableData = {
        Name: channelData.Name || channelData.name || '',
        Tags: channelData.Tags || '',
        Owner: channelData.Owner || null,
        avatar: channelData.avatar || '',
        subscribers: parseInt(channelData.subscribers) || 0
      }

      const params = {
        records: [updateableData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Channel created successfully')
          return successfulRecords[0].data
        }
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating channel:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(recordId, updateData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(recordId)
      }

      // Add only fields that are being updated
      if (updateData.Name !== undefined) updateableData.Name = updateData.Name
      if (updateData.name !== undefined) updateableData.Name = updateData.name
      if (updateData.Tags !== undefined) updateableData.Tags = updateData.Tags
      if (updateData.Owner !== undefined) updateableData.Owner = updateData.Owner
      if (updateData.avatar !== undefined) updateableData.avatar = updateData.avatar
      if (updateData.subscribers !== undefined) updateableData.subscribers = parseInt(updateData.subscribers)

      const params = {
        records: [updateableData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Channel updated successfully')
          return successfulUpdates[0].data
        }
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating channel:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(recordId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(recordId)]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Channel deleted successfully')
          return true
        }
      }

      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting channel:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const channelService = new ChannelService()