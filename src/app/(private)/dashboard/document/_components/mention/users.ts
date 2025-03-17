export interface User {
  id: number
  name: string
  email?: string
  avatar?: string
}

// Sample users for the mention feature
// In a real application, you would fetch this from your API
export const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alex Johnson", email: "alex@example.com" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com" },
  { id: 5, name: "Michael Brown", email: "michael@example.com" },
  { id: 6, name: "Emily Davis", email: "emily@example.com" },
  { id: 7, name: "David Wilson", email: "david@example.com" },
  { id: 8, name: "Olivia Taylor", email: "olivia@example.com" },
  { id: 9, name: "James Anderson", email: "james@example.com" },
  { id: 10, name: "Sophia Martinez", email: "sophia@example.com" },
]

