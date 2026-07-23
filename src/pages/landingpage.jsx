import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  MessageCircle, 
  Users, 
  Shield, 
  Star, 
  Zap, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Award,
  Sparkles,
  Quote,
  Play,
  Lock,
  Headphones
} from 'lucide-react';

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#081c2b] via-[#0e2a3f] to-[#081c2b]">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e89432]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#e89432]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1e4a6e]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto ">
           
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your AI-Powered Guide to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4ab5b] to-[#e89432] block mt-2">
                Employment Law in Kenya
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Instant answers about workplace rights, termination, wages, and compliance. 
              Trusted by 50,000+ Kenyan employees and employers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/chat" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#e89432] to-[#d47a1a] text-[#081c2b] rounded-xl font-semibold text-lg hover:from-[#f4ab5b] hover:to-[#e89432] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#e89432] text-[#f4ab5b] rounded-xl font-semibold text-lg hover:bg-[#e89432]/10 transition-all">
                <Play className="w-5 h-5" />
                Watch Demo
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3">
                <CheckCircle className="w-5 h-5 text-[#f4ab5b]" />
                <span className="text-gray-300 text-sm">50K+ Questions</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3">
                <Users className="w-5 h-5 text-[#f4ab5b]" />
                <span className="text-gray-300 text-sm">200+ Lawyers</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3">
                <Star className="w-5 h-5 text-[#f4ab5b] fill-[#f4ab5b]" />
                <span className="text-gray-300 text-sm">4.9 Rating</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3">
                <Headphones className="w-5 h-5 text-[#f4ab5b]" />
                <span className="text-gray-300 text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,218.7C960,235,1056,245,1152,234.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d47a1a] font-semibold text-sm uppercase tracking-wide">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#081c2b] mt-2 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful tools for employees, employers, and legal professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Legal Assistant Card - Link to /chat */}
            <Link 
              to="/chat" 
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#2c5f8a] to-[#1e4a6e] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#081c2b] mb-3">AI Legal Assistant</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Get instant answers about the Employment Act 2007. Our AI provides accurate, cited responses 24/7.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#d47a1a]">
                <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                <span>Free 10 questions to start</span>
              </div>
            </Link>

            {/* Verified Lawyers Card - Link to /lawyers */}
            <Link 
              to="/lawyers" 
              className="group bg-gradient-to-br from-[#fef8ee] to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#fad9ad] block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#e89432] to-[#d47a1a] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#081c2b] mb-3">Verified Lawyers</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Browse and connect with LSK-verified employment lawyers. Read reviews and compare rates.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#d47a1a]">
                <Shield className="w-4 h-4" />
                <span>100% verified professionals</span>
              </div>
            </Link>

            {/* Case Management Card - Link to /client/post-case */}
            <Link 
              to="/client/post-case" 
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#2c5f8a] to-[#1e4a6e] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#081c2b] mb-3">Case Management</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upload documents, track progress, and communicate securely with your lawyer.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#d47a1a]">
                <Lock className="w-4 h-4" />
                <span>End-to-end encrypted</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d47a1a] font-semibold text-sm uppercase tracking-wide">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#081c2b] mt-2 mb-4">
              Get Legal Help in 3 Easy Steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From question to resolution - faster than traditional legal channels
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1e4a6e] to-[#153a56] rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-12">
                    <span className="text-3xl font-bold text-white -rotate-12 inline-block">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#e89432] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#081c2b]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#081c2b] mb-2">Ask Your Question</h3>
                <p className="text-gray-600">Type your legal question about employment rights, termination, or wages</p>
              </div>

              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1e4a6e] to-[#153a56] rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-12">
                    <span className="text-3xl font-bold text-white -rotate-12 inline-block">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#e89432] rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#081c2b]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#081c2b] mb-2">AI Analyzes & Matches</h3>
                <p className="text-gray-600">Our AI searches the law and connects you with relevant lawyers if needed</p>
              </div>

              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1e4a6e] to-[#153a56] rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-12">
                    <span className="text-3xl font-bold text-white -rotate-12 inline-block">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#e89432] rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#081c2b]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#081c2b] mb-2">Get Resolution</h3>
                <p className="text-gray-600">Receive clear answers or work with a lawyer to resolve your case</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#081c2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e89432] mb-2">50K+</div>
              <div className="text-gray-400">Legal Questions Answered</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e89432] mb-2">200+</div>
              <div className="text-gray-400">Verified Lawyers</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e89432] mb-2">98%</div>
              <div className="text-gray-400">Client Satisfaction</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e89432] mb-2">24/7</div>
              <div className="text-gray-400">AI Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d47a1a] font-semibold text-sm uppercase tracking-wide">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#081c2b] mt-2 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands across Kenya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <Quote className="w-10 h-10 text-[#e89432] mb-4" />
              <p className="text-gray-700 leading-relaxed mb-4">
                "SheriAKE helped me understand my rights after wrongful termination. The AI gave me instant answers, and I found a great lawyer through the platform."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1e4a6e] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JM</span>
                </div>
                <div>
                  <p className="font-semibold text-[#081c2b]">James Mwangi</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <Quote className="w-10 h-10 text-[#e89432] mb-4" />
              <p className="text-gray-700 leading-relaxed mb-4">
                "As an employer, I use SheriAKE to ensure compliance. The chatbot answers my HR questions instantly, saving me thousands in legal fees."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1e4a6e] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MW</span>
                </div>
                <div>
                  <p className="font-semibold text-[#081c2b]">Mary Wambui</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <Quote className="w-10 h-10 text-[#e89432] mb-4" />
              <p className="text-gray-700 leading-relaxed mb-4">
                "The lawyer directory helped me find a specialist for my workplace discrimination case. The platform made the whole process seamless."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1e4a6e] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">PO</span>
                </div>
                <div>
                  <p className="font-semibold text-[#081c2b]">Peter Omondi</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432]" />
                    <Star className="w-4 h-4 fill-[#e89432] text-[#e89432] opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-[#081c2b] via-[#0e2a3f] to-[#081c2b]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Legal Clarity?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of Kenyans who trust SheriAKE for their employment law questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#e89432] to-[#d47a1a] text-[#081c2b] rounded-xl font-semibold text-lg hover:from-[#f4ab5b] hover:to-[#e89432] transition-all transform hover:scale-105 shadow-xl">
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/lawyers" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#e89432] text-[#f4ab5b] rounded-xl font-semibold text-lg hover:bg-[#e89432]/10 transition-all">
              Browse Lawyers
              <Users className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#e89432]" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#e89432]" />
              Free 10 questions
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;