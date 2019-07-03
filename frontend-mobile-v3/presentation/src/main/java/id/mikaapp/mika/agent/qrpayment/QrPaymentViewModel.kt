package id.mikaapp.mika.agent.qrpayment

import androidx.lifecycle.MutableLiveData
import id.mikaapp.mika.common.BaseViewModel
import id.mikaapp.mika.common.SingleLiveEvent
import id.mikaapp.sdk.MikaSdk
import id.mikaapp.sdk.callbacks.CreateTransactionCallback
import id.mikaapp.sdk.callbacks.TransactionDetailCallback
import id.mikaapp.sdk.models.BasicResponse
import id.mikaapp.sdk.models.TokenTransaction
import id.mikaapp.sdk.models.TransactionDetail

/**
 * Created by grahamdesmon on 15/04/19.
 */

class QrPaymentViewModel(
    private val mikaSdk: MikaSdk
) : BaseViewModel() {

    var viewState: MutableLiveData<QrPaymentViewState> = MutableLiveData()
    var errorState: SingleLiveEvent<Throwable?> = SingleLiveEvent()

    init {
        viewState.value = QrPaymentViewState()
    }

    fun createTransaction(
        acquirerId: String,
        amount: Int,
        locationLat: String,
        locationLong: String
    ) {
        errorState.value = null
        viewState.value = viewState.value?.copy(
            showLoading = true
        )
        performCreateTransaction(acquirerId, amount, locationLat, locationLong)
    }

    private fun performCreateTransaction(
        acquirerId: String,
        amount: Int,
        locationLat: String,
        locationLong: String
    ) {
        mikaSdk.createTransaction(
            acquirerId,
            amount,
            locationLat,
            locationLong,
            object : CreateTransactionCallback {
                override fun onSuccess(response: TokenTransaction) {
                    viewState.value?.let {
                        val newState = viewState.value?.copy(
                            showLoading = false,
                            tokenTransaction = response
                        )
                        viewState.value = newState
                        errorState.value = null
                    }
                }

                override fun onFailure(errorResponse: BasicResponse) {
                    viewState.value = viewState.value?.copy(showLoading = false)
                    errorState.value = Throwable(errorResponse.message)
                }

                override fun onError(error: Throwable) {
                    viewState.value = viewState.value?.copy(showLoading = false)
                    errorState.value = error
                }

            })
    }

    fun getTransactionDetail(id: String) {
        errorState.value = null
        viewState.value = viewState.value?.copy(
            showLoading = true,
            transactionDetail = null,
            transactionDetailLoaded = false
        )

        performGetTransactionDetail(id)
    }

    fun getTransactionDetailPeriodic(id: String) {
        errorState.value = null
        viewState.value = viewState.value?.copy(
            showLoading = false,
            transactionDetail = null,
            transactionDetailLoaded = false
        )

        performGetTransactionDetail(id)
    }

    private fun performGetTransactionDetail(id: String) {
        mikaSdk.getTransactionById(id, object : TransactionDetailCallback {
            override fun onSuccess(response: TransactionDetail) {
                viewState.value?.let {
                    val newState = viewState.value?.copy(
                        showLoading = false,
                        transactionDetailLoaded = true,
                        transactionDetail = response
                    )
                    viewState.value = newState
                    errorState.value = null
                }
            }

            override fun onFailure(errorResponse: BasicResponse) {
                viewState.value = viewState.value?.copy(showLoading = false, transactionDetailLoaded = true)
                errorState.value = Throwable(errorResponse.message)
            }

            override fun onError(error: Throwable) {
                viewState.value = viewState.value?.copy(showLoading = false, transactionDetailLoaded = true)
                errorState.value = error
            }

        })
    }
}