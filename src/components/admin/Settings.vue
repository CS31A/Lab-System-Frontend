<script setup lang="ts">
import { Download, Upload } from 'lucide-vue-next'
// IMPORTS
import { ref } from 'vue'

// REFS & REACTIVE STATE
const seatLayout = ref({
  rows: '4',
  columns: '5',
})

const notificationSettings = ref({
  emailNotifications: true,
  systemLogs: true,
  conflictAlerts: true,
})

const newRoomName = ref('')
const newRoomCapacity = ref<number | null>(null)

const newAdmin = ref({
  name: '',
  email: '',
  password: '',
})

const rooms = ref([
  { id: '1', name: 'Slab 1', capacity: 20 },
  { id: '2', name: 'Slab 2', capacity: 20 },
  { id: '3', name: 'Slab 3', capacity: 20 },
  { id: '4', name: 'Slab 4', capacity: 25 },
  { id: '5', name: 'Slab 5', capacity: 25 },
  { id: '6', name: 'SCLAB', capacity: 30 },
  { id: '7', name: 'Linux', capacity: 15 },
])

const admins = ref([
  {
    id: '1',
    name: 'Admin',
    email: 'admin@gmail.com',
    lastLogin: 'Today, 09:45 AM',
  },
  {
    id: '2',
    name: 'Albert Einstein',
    email: 'albert.einstein@gmail.com',
    lastLogin: 'Yesterday, 4:30 PM',
  },
])

// METHODS
// UPDATE SEAT LAYOUT CONFIGURATION
function updateSeatLayout() {
  // eslint-disable-next-line no-console
  console.log('Updating seat layout:', seatLayout.value)
}

// ADD NEW ROOM TO ROOMS LIST
function addRoom() {
  // VALIDATE REQUIRED FIELDS
  if (newRoomName.value && newRoomCapacity.value) {
    rooms.value.push({
      id: Date.now().toString(),
      name: newRoomName.value,
      capacity: newRoomCapacity.value,
    })
    // RESET FORM FIELDS
    newRoomName.value = ''
    newRoomCapacity.value = null
  }
}

// REMOVE ROOM FROM ROOMS LIST
function removeRoom(roomId: string) {
  // CONFIRM BEFORE DELETION
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to remove this room?')) {
    const index = rooms.value.findIndex(room => room.id === roomId)
    if (index > -1) {
      rooms.value.splice(index, 1)
    }
  }
}

// SAVE NOTIFICATION SETTINGS
function saveNotificationSettings() {
  // eslint-disable-next-line no-console
  console.log('Saving notification settings:', notificationSettings.value)
}

// ADD NEW ADMIN ACCOUNT
function addAdmin() {
  // VALIDATE ALL REQUIRED FIELDS
  if (newAdmin.value.name && newAdmin.value.email && newAdmin.value.password) {
    admins.value.push({
      id: Date.now().toString(),
      name: newAdmin.value.name,
      email: newAdmin.value.email,
      lastLogin: 'Never',
    })
    // RESET FORM FIELDS
    newAdmin.value = { name: '', email: '', password: '' }
  }
}

// DELETE ADMIN ACCOUNT
function deleteAdmin(adminId: string) {
  // CONFIRM BEFORE DELETION
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this admin?')) {
    const index = admins.value.findIndex(admin => admin.id === adminId)
    if (index > -1) {
      admins.value.splice(index, 1)
    }
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      System Settings
    </h2>

    <!-- SEAT LAYOUT -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">
          Seat Layout Configuration
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rows</label>
            <select
              v-model="seatLayout.rows"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
              <option value="4">
                4
              </option>
              <option value="5">
                5
              </option>
              <option value="6">
                6
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Columns</label>
            <select
              v-model="seatLayout.columns"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
              <option value="5">
                5
              </option>
              <option value="6">
                6
              </option>
              <option value="7">
                7
              </option>
            </select>
          </div>
        </div>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] transition-colors"
          @click="updateSeatLayout"
        >
          Update Layout
        </button>
      </div>
    </div>

    <!-- LAB MANAGEMENT -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">
          Lab Management
        </h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="room in rooms"
            :key="room.id"
            class="flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-medium text-gray-800">
                {{ room.name }}
              </p>
              <p class="text-xs text-gray-500">
                Capacity: {{ room.capacity }} seats
              </p>
            </div>
            <button
              class="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
              @click="removeRoom(room.id)"
            >
              Remove
            </button>
          </div>
        </div>
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Add New Room</label>
          <div class="flex space-x-2">
            <input
              v-model="newRoomName"
              type="text"
              class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              placeholder="Room Number"
            >
            <input
              v-model="newRoomCapacity"
              type="number"
              class="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              placeholder="Capacity"
              min="1"
              max="50"
            >
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] transition-colors"
              @click="addRoom"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- NOTIFICATION SETTINGS -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-800">
            Notification Settings
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Email Notifications
                </p>
                <p class="text-xs text-gray-500">
                  Receive email alerts for important changes
                </p>
              </div>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.emailNotifications"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800">
                  System Logs
                </p>
                <p class="text-xs text-gray-500">
                  Keep records of all admin activities
                </p>
              </div>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.systemLogs"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Conflict Alerts
                </p>
                <p class="text-xs text-gray-500">
                  Notify about scheduling conflicts
                </p>
              </div>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.conflictAlerts"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
          <button
            class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] transition-colors"
            @click="saveNotificationSettings"
          >
            Save Settings
          </button>
        </div>
      </div>

      <!-- DATA MANAGEMENT -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-800">
            Data Management
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Backup Data</label>
              <button class="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Download class="mr-2 w-4 h-4" />
                Export Database
              </button>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Restore Data</label>
              <button class="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Upload class="mr-2 w-4 h-4" />
                Import Database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADMIN ACCOUNTS -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">
          Admin Accounts
        </h3>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="admin in admins" :key="admin.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ admin.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ admin.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ admin.lastLogin }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3 transition-colors">
                    Edit
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900 transition-colors"
                    @click="deleteAdmin(admin.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Add New Admin
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Name</label>
              <input
                v-model="newAdmin.name"
                type="text"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input
                v-model="newAdmin.email"
                type="email"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Password</label>
              <input
                v-model="newAdmin.password"
                type="password"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              >
            </div>
            <div class="flex items-end">
              <button
                class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] transition-colors"
                @click="addAdmin"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
