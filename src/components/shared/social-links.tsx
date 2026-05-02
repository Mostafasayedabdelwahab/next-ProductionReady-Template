import type { SiteSettingsEntity } from '@/features/site-settings';
import { siFacebook, siInstagram, siX, siYoutube } from 'simple-icons';

type SocialLinksProps = {
    settings: SiteSettingsEntity;
};

export default function SocialLinks({ settings }: SocialLinksProps) {
    const socialMedia = [
        { url: settings.facebookUrl, icon: siFacebook, color: `#${siFacebook.hex}` },
        { url: settings.instagramUrl, icon: siInstagram, color: `#${siInstagram.hex}` },
        { url: settings.twitterUrl, icon: siX, color: `#${siX.hex}` },
        { url: settings.youtubeUrl, icon: siYoutube, color: `#${siYoutube.hex}` },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {socialMedia.map((item, index) => {
                if (!item.url) return null;
                return (
                    <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2.5 rounded-xl bg-muted transition-all duration-300 hover:text-white hover:bg-(--brand-color)"
                        style={{
                            "--brand-color": item.color
                        } as React.CSSProperties}
                        aria-label={`Visit our ${item.icon.title} page`}
                    >
                        <svg
                            role="img"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 transition-colors"
                        >
                            <path d={item.icon.path} />
                        </svg>
                    </a>
                );
            })}

            {settings.linkedinUrl && (
                <a
                    
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2.5 rounded-xl bg-muted transition-all duration-300 hover:text-white hover:bg-(--brand-color)"
                    style={{
                        "--brand-color": `#0A66C2`
                    } as React.CSSProperties}
                    aria-label="LinkedIn"
                >
                    <svg
                        role="img"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 transition-colors"
                    >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
            )}


        </div>
    );
}