import { Layout } from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            AI Resume Builder
          </h1>
          <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-8">
            Create professional resumes with the power of artificial intelligence. 
            Build, customize, and optimize your resume for any job opportunity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              View Templates
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Leverage artificial intelligence to create compelling resume content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes job descriptions and suggests optimized content for your resume.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Templates</CardTitle>
              <CardDescription>
                Choose from a variety of modern, ATS-friendly templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All templates are designed to pass Applicant Tracking Systems and impress recruiters.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Easy Export</CardTitle>
              <CardDescription>
                Download your resume in multiple formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Export as PDF, Word document, or share a live link to your online resume.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
