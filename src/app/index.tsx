import useSocialAuth from "@/hooks/useSocialAuth"
import { useAuth, useClerk, useUser, useUserProfileModal } from '@clerk/expo'
import { UserButton } from '@clerk/expo/native'
import { FontAwesome } from "@expo/vector-icons"
import { Image } from "expo-image"
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"

export default function MainScreen() {
    const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false })
    const { user } = useUser()
    const { signOut } = useClerk()
    const { presentUserProfile } = useUserProfileModal()
    const { handleSocialAuth, loadingStrategy } = useSocialAuth()

    if (!isLoaded) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!isSignedIn) {
        const isGoogleClicked = loadingStrategy === "oauth_google";
        const isAppleClicked = loadingStrategy === "oauth_apple";
        const isGithubClicked = loadingStrategy === "oauth_github";

        const isLoading = isGoogleClicked || isAppleClicked || isGithubClicked;

        return (
            <SafeAreaView className="flex-1 bg-primary dark:bg-secondary" edges={["top"]}>
                <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
                <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

                <View className="px-6 pt-4">
                    <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
                        Grocify
                    </Text>
                    <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
                        Plan smarter. Shop happier.
                    </Text>

                    <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
                        <Image
                            source={require("../../assets/images/auth.png")}
                            style={{ width: "100%", height: 300 }}
                            contentFit="contain" />
                    </View>
                </View>

                <View className="mt-8 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
                    <View className="self-center rounded-full bg-secondary px-3 py-1">
                        <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
                            Welcome Back
                        </Text>
                    </View>

                    <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
                        Choose a social provider and jump right into your personalized grocery experience.
                    </Text>

                    <View className="mt-6">
                        <Pressable
                            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${isLoading ? "opacity-70" : ""}`}
                            disabled={isLoading}
                            onPress={() => handleSocialAuth("oauth_google")}>

                            <View className="size-8 items-center justify-center rounded-full bg-white">
                                <Image source={require("../../assets/images/google.png")} style={{ width: 20, height: 20 }} />
                            </View>

                            <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                                {isGoogleClicked ? "Connecting Google..." : "Continue with Google"}
                            </Text>

                            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
                        </Pressable>

                        <Pressable
                            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${isLoading ? "opacity-70" : ""}`}
                            disabled={isLoading}
                            onPress={() => handleSocialAuth("oauth_github")}>

                            <View className="size-8 items-center justify-center rounded-full bg-white">
                                <FontAwesome name="github" size={24} color="#111" />
                            </View>

                            <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                                {isGithubClicked ? "Connecting Github..." : "Continue with Github"}
                            </Text>

                            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
                        </Pressable>

                        <Pressable
                            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${isLoading ? "opacity-70" : ""}`}
                            disabled={isLoading}
                            onPress={() => handleSocialAuth("oauth_apple")}>

                            <View className="size-8 items-center justify-center rounded-full bg-white">
                                <FontAwesome name="apple" size={24} color="#111" />
                            </View>

                            <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                                {isAppleClicked ? "Connecting Apple..." : "Continue with Apple"}
                            </Text>

                            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
                        </Pressable>
                    </View>

                    <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome</Text>
                <View style={{ width: 44, height: 44, borderRadius: 22, overflow: 'hidden' }}>
                    <UserButton />
                </View>
            </View>
            <View style={styles.profileCard}>
                {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.avatar} />}
                <View>
                    <Text>Hello {user?.firstName ?? user?.id}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.linkButton} onPress={presentUserProfile}>
                <Text style={styles.linkButtonText}>Manage Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.linkButton, { backgroundColor: '#666' }]}
                onPress={() => signOut()}
            >
                <Text style={styles.linkButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    linkButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    linkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})