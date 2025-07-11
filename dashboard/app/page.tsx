import fs from 'fs'
import path from 'path'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const projectDir = path.join(process.cwd(), 'projects')
  const projects = fs.existsSync(projectDir)
    ? fs.readdirSync(projectDir).filter(name => fs.statSync(path.join(projectDir, name)).isDirectory())
    : []

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 ZeroDev Projects</h1>
      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects found in /projects</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(name => {
            const logPath = path.join(projectDir, name, 'codegen.log')
            const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf-8') : 'No log found.'
            return (
              <Card key={name}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold text-lg">{name}</h2>
                  <ScrollArea className="h-40 border rounded p-2 text-sm">
                    <pre className="whitespace-pre-wrap">{log.slice(0, 1500)}</pre>
                  </ScrollArea>
                  <Button variant="secondary" size="sm">View Full Log</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
