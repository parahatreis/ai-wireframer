import { useUser } from '@clerk/clerk-react'

export default function Account() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account preferences.</p>
      </section>

      {/* Profile Section */}
      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {user?.imageUrl && (
              <img src={user.imageUrl} alt={user.fullName || 'User'} className="h-16 w-16 rounded-full" />
            )}
            <div>
              <p className="font-medium">{user?.fullName || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="mt-1">{user?.firstName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="mt-1">{user?.lastName || 'Not set'}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1">{user?.primaryEmailAddress?.emailAddress || 'Not set'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Account Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">Manage email and push notifications</p>
            </div>
            <button className="text-sm text-primary hover:underline">Configure</button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Privacy</p>
              <p className="text-sm text-muted-foreground">Control your data and privacy settings</p>
            </div>
            <button className="text-sm text-primary hover:underline">Manage</button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">API Access</p>
              <p className="text-sm text-muted-foreground">Generate and manage API keys</p>
            </div>
            <button className="text-sm text-primary hover:underline">View Keys</button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-destructive">Danger Zone</h2>
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-background p-4">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
            Delete
          </button>
        </div>
      </section>
    </div>
  )
}

