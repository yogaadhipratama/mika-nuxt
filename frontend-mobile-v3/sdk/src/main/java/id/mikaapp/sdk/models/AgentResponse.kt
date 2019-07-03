package id.mikaapp.sdk.models

import com.google.gson.annotations.SerializedName

data class AgentResponse(
    @SerializedName("data")
    var data: Agent,
    @SerializedName("isError")
    var isError: Boolean,
    @SerializedName("message")
    var message: String,
    @SerializedName("status")
    var status: String,
    @SerializedName("version")
    var version: String
)