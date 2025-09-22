import { BarChart3, Shield, Link2, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "Get your shortened URLs instantly with our optimized infrastructure."
    },
    {
      icon: <Link2 className="h-8 w-8 text-green-600" />,
      title: "Custom Short Codes",
      description: "Create memorable, branded links with your own custom short codes."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Click Analytics",
      description: "Track click counts and view detailed statistics for your shortened URLs."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Reliable & Secure",
      description: "Built with modern technologies and best practices for security and reliability."
    }
  ]

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Core features for creating, managing, and tracking your shortened URLs with modern web technologies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}