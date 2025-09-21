import React from "react";
import { InteractionsClient } from "./InteractionsClient";

export default function PhotographerProfile() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section
        className="hero min-h-96 relative"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1592487111738-caa190fcb6e7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1920&h=600")',
        }}
      >
        <div className="hero-overlay bg-base-300/70"></div>
        <div className="hero-content text-center text-base-content">
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl font-bold">
                AS
              </div>
              <div className="flex-1 text-left">
                <h1 className="text-5xl font-bold mb-2">Alex Smith</h1>
                <p className="text-xl text-base-content/80 mb-4">建筑与室内摄影专家</p>
                <div className="flex items-center gap-2 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="iconify text-warning" data-icon="heroicons:star-solid" data-width="16"></span>
                  ))}
                  <span className="text-sm text-base-content/70">(4.9/5 来自127条评价)</span>
                </div>
                <p className="text-base-content/90 mb-6 max-w-2xl">
                  以精准和艺术性捕捉空间。专注于豪华房地产、商业空间和建筑记录，拥有超过8年的经验。
                </p>
                <div className="flex flex-wrap gap-4 items-center mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="iconify text-primary" data-icon="heroicons:envelope" data-width="16"></span>
                    <span>alex.smith@photography.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="iconify text-primary" data-icon="heroicons:phone" data-width="16"></span>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex gap-2">
                    <a className="btn btn-sm btn-ghost" href="https://alexsmith-photography.com" target="_blank">官网</a>
                    <a className="btn btn-sm btn-ghost" href="https://linkedin.com/in/alexsmith" target="_blank">LinkedIn</a>
                    <a className="btn btn-sm btn-ghost" href="https://instagram.com/alexsmith_photo" target="_blank">Instagram</a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="iconify text-primary" data-icon="heroicons:map-pin" data-width="16"></span>
                    <span>纽约市，纽约州</span>
                  </div>
                  <InteractionsClient />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="card bg-base-100 shadow-xl">
              <figure className="relative">
                <img
                  src="https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2025/9/13/f65e1d61-f090-4a43-8f82-9a5faff4e28d.png"
                  alt="幕后花絮"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-base-300/90 px-2 py-1 rounded text-sm">5:42</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="btn btn-circle btn-lg btn-primary">
                    <span className="iconify" data-icon="heroicons:play-solid" data-width="32"></span>
                  </button>
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title">幕后花絮：豪华顶层公寓拍摄</h3>
                <p>
                  独家了解Alex在拍摄这个令人惊叹的曼哈顿顶层公寓时的创作过程。了解用于创建完美3D导览的技术和设备。
                </p>
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "现代豪华公寓",
                desc: "一套令人惊叹的2居室公寓，具有现代设计和全景城市景观。",
                cat: "住宅",
                loc: "纽约",
                time: "2天前",
                img: "https://images.unsplash.com/photo-1751998816160-0bdb329a3b9f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300",
              },
              {
                title: "企业办公空间",
                desc: "具有现代设施和协作工作空间的专业办公环境。",
                cat: "商业",
                loc: "曼哈顿",
                time: "1周前",
                img: "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300",
              },
              {
                title: "精品餐厅",
                desc: "具有精心策划的室内设计和环境照明的私密用餐空间。",
                cat: "餐厅",
                loc: "布鲁克林",
                time: "2周前",
                img: "https://images.unsplash.com/photo-1754479126536-11a38507a122?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300",
              },
            ].map((t) => (
              <div key={t.title} className="card bg-base-100 shadow-xl tour-card cursor-pointer">
                <figure>
                  <img src={t.img} alt={t.title} className="w-full h-48 object-cover" />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-lg">{t.title}</h3>
                  <p className="text-sm text-base-content/70">{t.desc}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <div className="badge badge-primary badge-sm">{t.cat}</div>
                      <div className="badge badge-outline badge-sm">{t.loc}</div>
                    </div>
                    <span className="text-xs text-base-content/60">{t.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="btn btn-primary btn-lg">
              <span className="iconify" data-icon="heroicons:plus" data-width="20"></span>
              显示更多作品
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">关于摄影师</h2>
            <div className="prose prose-lg max-w-none text-base-content">
              <p className="text-xl leading-relaxed mb-8">
                Alex Smith是一位著名的建筑和室内摄影师，拥有超过8年的经验，通过创新的3D技术捕捉空间的精髓。
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Alex的艺术视野将技术精准与创意叙事相结合，利用尖端的3D扫描技术和传统摄影技术创建导览。
              </p>
              <p className="text-lg leading-relaxed mb-8">
                专注于豪华住宅物业、商业空间和酒店场所，Alex已建立了卓越声誉。
              </p>
              <p className="text-lg leading-relaxed">
                当不在相机后面时，Alex热衷于指导新兴摄影师，探索虚拟现实的新技术。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">有兴趣与Alex Smith合作吗？</h2>
            <p className="text-lg text-base-content/80 mb-8">
              准备用令人惊叹的3D导览展示您的空间？联系我们讨论您的项目，让您的愿景成为现实。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-lg">
                <span className="iconify" data-icon="heroicons:envelope" data-width="20"></span>
                直接联系Alex
              </button>
              <button className="btn btn-outline btn-lg">
                <span className="iconify" data-icon="heroicons:building-office" data-width="20"></span>
                联系Realsee
              </button>
            </div>
            <p className="text-sm text-base-content/60 mt-6">
              或者正在寻找专业的3D导览服务？我们Realsee团队在这里帮助您找到满足您需求的完美摄影师。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


